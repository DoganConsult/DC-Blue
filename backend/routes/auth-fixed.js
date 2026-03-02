import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this-in-production';
const RESET_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://doganconsult.com';

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default function authRouter(pool) {
  const router = Router();

  /* ── POST /auth/register ────────────────────────────────── */
  router.post('/auth/register', async (req, res) => {
    try {
      const { username, email, password, name, company } = req.body || {};

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if user exists
      const existing = await pool.query(
        `SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1`,
        [email]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const hash = await bcrypt.hash(password, 12);

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, company, role, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, full_name, company, role, created_at`,
        [
          email.toLowerCase(),
          hash,
          name || username || email.split('@')[0],
          company || null,
          'customer', // Default role
          true
        ]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update last_login
      await pool.query(
        `UPDATE users SET last_login = NOW() WHERE id = $1`,
        [user.id]
      );

      res.status(201).json({
        ok: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          company: user.company,
          role: user.role
        }
      });

    } catch (e) {
      console.error('Register error:', e.message);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  /* ── POST /auth/login ───────────────────────────────────── */
  router.post('/auth/login', async (req, res) => {
    try {
      const { identifier, password } = req.body || {};

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const result = await pool.query(
        `SELECT id, email, password_hash, full_name, company, role, is_active
         FROM users
         WHERE lower(email) = lower($1) LIMIT 1`,
        [identifier]
      );

      if (!result.rows.length) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update last_login
      await pool.query(
        `UPDATE users SET last_login = NOW() WHERE id = $1`,
        [user.id]
      );

      res.json({
        ok: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          company: user.company,
          role: user.role
        }
      });

    } catch (e) {
      console.error('Login error:', e.message);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  /* ── GET /auth/me ───────────────────────────────────────── */
  router.get('/auth/me', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const payload = jwt.verify(token, JWT_SECRET);

      const result = await pool.query(
        `SELECT id, email, full_name, company, role, created_at, last_login
         FROM users
         WHERE id = $1 AND is_active = true LIMIT 1`,
        [payload.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ error: 'User not found or inactive' });
      }

      res.json({
        ok: true,
        user: result.rows[0]
      });

    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  /* ── POST /auth/logout ──────────────────────────────────── */
  router.post('/auth/logout', (req, res) => {
    // Client should remove token from storage
    res.json({ ok: true, message: 'Logged out successfully' });
  });

  /* ── POST /auth/forgot-password ──────────────────────────── */
  router.post('/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body || {};

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Check if password_reset_tokens table exists
      const tableCheck = await pool.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'password_reset_tokens')`
      );
      if (!tableCheck.rows[0].exists) {
        console.error('[forgot-password] ERROR: password_reset_tokens table does not exist! Run migration.');
        return res.status(500).json({ error: 'Password reset is not configured. Please contact support.' });
      }

      const userR = await pool.query(
        `SELECT id, full_name FROM users WHERE lower(email) = lower($1) AND is_active = true LIMIT 1`,
        [email]
      );

      if (userR.rows.length) {
        const userId = userR.rows[0].id;
        const userName = userR.rows[0].full_name;

        // Invalidate any existing tokens
        await pool.query(
          `UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND user_table = 'users' AND used = false`,
          [userId]
        );

        // Generate and hash token
        const rawToken = generateResetToken();
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        await pool.query(
          `INSERT INTO password_reset_tokens (user_id, user_table, token_hash, expires_at)
           VALUES ($1, 'users', $2, $3) RETURNING id`,
          [userId, tokenHash, new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)]
        );

        const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

        await sendEmail(pool, 'password_reset', {
          contact_name: userName || email,
          reset_url: resetUrl,
          expires_minutes: 60,
        }, email, 'en');
      }

      // Always return success to prevent email enumeration
      res.json({
        ok: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });

    } catch (e) {
      console.error('Forgot password error:', e.message);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  /* ── POST /auth/reset-password ──────────────────────────── */
  router.post('/auth/reset-password', async (req, res) => {
    try {
      const { token, email, new_password } = req.body || {};

      if (!token || !email || !new_password) {
        return res.status(400).json({ error: 'Token, email, and new password are required' });
      }

      if (new_password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      // Check if table exists
      const tableCheck = await pool.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'password_reset_tokens')`
      );
      if (!tableCheck.rows[0].exists) {
        console.error('[reset-password] ERROR: password_reset_tokens table does not exist!');
        return res.status(500).json({ error: 'Password reset is not configured. Please contact support.' });
      }

      // Look up the token
      const debugRow = await pool.query(
        `SELECT id, used, expires_at FROM password_reset_tokens WHERE token_hash = $1`,
        [tokenHash]
      );
      const resetRow = await pool.query(
        `SELECT id, user_id, expires_at FROM password_reset_tokens
         WHERE token_hash = $1 AND used = false LIMIT 1`,
        [tokenHash]
      );

      if (!resetRow.rows.length) {
        if (debugRow.rows.length > 0 && debugRow.rows[0].used) {
          return res.status(400).json({ error: 'This reset link has already been used. Please request a new one.' });
        }
        return res.status(400).json({ error: 'Invalid or expired reset token. Please request a new password reset link.' });
      }

      const rt = resetRow.rows[0];

      if (new Date(rt.expires_at) < new Date()) {
        await pool.query(`UPDATE password_reset_tokens SET used = true WHERE id = $1`, [rt.id]);
        return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
      }

      // Verify email matches user
      const r = await pool.query(`SELECT email FROM users WHERE id = $1`, [rt.user_id]);
      const verifyEmail = r.rows[0]?.email;

      if (!verifyEmail || verifyEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ error: 'Invalid reset request' });
      }

      // Update password
      const hash = await bcrypt.hash(new_password, 12);
      await pool.query(
        `UPDATE users SET password_hash = $1, must_change_password = false, access_failed_count = 0, lockout_end = NULL, updated_at = NOW() WHERE id = $2`,
        [hash, rt.user_id]
      );

      // Mark token used
      await pool.query(`UPDATE password_reset_tokens SET used = true WHERE id = $1`, [rt.id]);

      res.json({ ok: true, message: 'Password has been reset successfully. You can now sign in.' });

    } catch (e) {
      console.error('Reset password error:', e.message);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  return router;
}