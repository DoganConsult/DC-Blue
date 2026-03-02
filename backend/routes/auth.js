import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt.js';
import { getSecurityConfig, validatePasswordPolicy } from '../config/security.js';
import { sendEmail } from '../services/email.js';

const MFA_CODE_EXPIRY_MS = 10 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://doganconsult.com';

const VALID_CATEGORIES = [
  'customer',
  'partner',
  'freelancer',
  'vendor',
  'technology-partner',
  'service-partner',
  'design-partner',
];

function generateCode() {
  return String(crypto.randomInt(100000, 999999));
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default function authRouter(pool) {
  const JWT_SECRET = getJwtSecret();
  const security = getSecurityConfig();
  const router = Router();

  /* ── POST /auth/register ────────────────────────────────── */
  router.post('/auth/register', async (req, res) => {
    try {
      const { username, email, password, name, company, category } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const policy = validatePasswordPolicy(password, security);
      if (!policy.valid) {
        return res.status(400).json({ error: policy.error });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'customer';

      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (emailDomain === 'doganconsult.com') {
        return res.status(403).json({ error: 'Dogan Consult team accounts are created by admin only. Contact your administrator.' });
      }

      const existing = await pool.query(
        `SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1`,
        [email]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hash = await bcrypt.hash(password, 12);
      const userRole = safeCategory === 'customer' ? 'customer' : 'partner';

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, company, role, category, is_active, mfa_enabled, approval_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, full_name, company, role, category, created_at`,
        [
          email.toLowerCase(),
          hash,
          name || username || email.split('@')[0],
          company || null,
          userRole,
          safeCategory,
          true,
          false,
          'auto_approved'
        ]
      );

      const user = result.rows[0];

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]);

      // Notify admins of new registration
      try {
        await pool.query(
          `INSERT INTO admin_notifications (user_id, type, title, body, link)
           SELECT id, 'registration', $1, $2, $3 FROM users WHERE role = 'admin'`,
          [
            `New registration: ${user.full_name}`,
            `${user.email} registered as ${safeCategory}${company ? ` (${company})` : ''}`,
            '/admin?tab=team',
          ]
        );
      } catch (_) {}

      // Link to existing partner record if email matches
      if (userRole === 'partner') {
        try {
          await pool.query(
            `UPDATE partners SET user_id = $1 WHERE lower(contact_email) = lower($2) AND user_id IS NULL`,
            [user.id, user.email]
          );
        } catch (_) {}
      }

      // Send welcome email
      try {
        const loginUrl = `${FRONTEND_URL}/workspace`;
        await sendEmail(pool, 'welcome_registration', {
          contact_name: user.full_name,
          email: user.email,
          category: safeCategory,
          login_url: loginUrl,
        }, user.email, 'en');
      } catch (_) {}

      // Redirect all non-admin users to unified workspace
      const redirect_url = '/workspace';

      res.status(201).json({
        ok: true,
        token,
        redirect_url,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          company: user.company,
          role: user.role,
          category: user.category,
        }
      });

    } catch (e) {
      console.error('Register error:', e.message);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  /* ── GET /auth/categories ───────────────────────────────── */
  router.get('/auth/categories', (req, res) => {
    res.json({
      ok: true,
      categories: [
        { value: 'customer', label: 'Customer', labelAr: 'عميل' },
        { value: 'partner', label: 'Partner', labelAr: 'شريك' },
        { value: 'freelancer', label: 'Freelancer', labelAr: 'مستقل' },
        { value: 'vendor', label: 'Vendor', labelAr: 'مورد' },
        { value: 'technology-partner', label: 'Technology Partner', labelAr: 'شريك تقني' },
        { value: 'service-partner', label: 'Service Partner', labelAr: 'شريك خدمات' },
        { value: 'design-partner', label: 'Design Partner', labelAr: 'شريك تصميم' },
      ],
    });
  });

  /* ── POST /auth/login ───────────────────────────────────── */
  router.post('/auth/login', async (req, res) => {
    try {
      const { identifier, email, password } = req.body || {};
      const loginEmail = identifier || email; // Accept both field names

      if (!loginEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await pool.query(
        `SELECT id, email, password_hash, full_name, company, role, category, is_active,
                COALESCE(access_failed_count, 0) AS access_failed_count,
                lockout_end,
                COALESCE(must_change_password, false) AS must_change_password,
                COALESCE(mfa_enabled, false) AS mfa_enabled
         FROM users WHERE lower(email) = lower($1) LIMIT 1`,
        [loginEmail]
      );

      if (!result.rows.length) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      const lockoutEnd = user.lockout_end ? new Date(user.lockout_end) : null;
      if (lockoutEnd && lockoutEnd > new Date()) {
        return res.status(403).json({
          error: 'Account temporarily locked due to too many failed attempts. Try again later.'
        });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        const failedCount = (user.access_failed_count || 0) + 1;
        const lockoutEndAt = failedCount >= security.maxLoginAttempts
          ? new Date(Date.now() + security.lockoutDurationMs)
          : null;
        await pool.query(
          `UPDATE users SET access_failed_count = $2, lockout_end = $3, updated_at = NOW() WHERE id = $1`,
          [user.id, failedCount, lockoutEndAt]
        );
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      await pool.query(
        `UPDATE users SET access_failed_count = 0, lockout_end = NULL, last_login = NOW(), updated_at = NOW() WHERE id = $1`,
        [user.id]
      );

      // If MFA is disabled for this user, return JWT directly (no MFA step)
      if (!user.mfa_enabled) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          ok: true,
          token,
          user: {
            id: user.id, email: user.email, full_name: user.full_name,
            company: user.company, role: user.role, category: user.category,
            must_change_password: user.must_change_password,
            mfa_enabled: false,
          },
        });
      }

      // MFA enabled — send code
      const code = generateCode();
      const codeHash = await bcrypt.hash(code, 8);

      await pool.query(
        `UPDATE mfa_codes SET used = true WHERE user_id = $1 AND user_table = 'users' AND used = false`,
        [user.id]
      );

      await pool.query(
        `INSERT INTO mfa_codes (user_id, user_table, code_hash, purpose, expires_at)
         VALUES ($1, 'users', $2, 'login', $3)`,
        [user.id, codeHash, new Date(Date.now() + MFA_CODE_EXPIRY_MS)]
      );

      const mfaSession = jwt.sign(
        { id: user.id, email: user.email, role: user.role, mfa_pending: true },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      await sendEmail(pool, 'mfa_code', { code, contact_name: user.full_name || user.email }, user.email, 'en');

      return res.json({
        ok: true,
        mfa_required: true,
        mfa_session: mfaSession,
        user: { email: user.email },
      });

    } catch (e) {
      console.error('Login error:', e.message);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  /* ── POST /auth/verify-mfa ──────────────────────────────── */
  router.post('/auth/verify-mfa', async (req, res) => {
    try {
      const { mfa_session, code } = req.body || {};
      if (!mfa_session || !code) {
        return res.status(400).json({ error: 'MFA session and code are required' });
      }

      let payload;
      try {
        payload = jwt.verify(mfa_session, JWT_SECRET);
      } catch (_) {
        return res.status(401).json({ error: 'MFA session expired. Please login again.' });
      }

      if (!payload.mfa_pending) {
        return res.status(400).json({ error: 'Invalid MFA session' });
      }

      const rows = await pool.query(
        `SELECT id, code_hash, expires_at FROM mfa_codes
         WHERE user_id = $1 AND user_table = 'users' AND used = false AND purpose = 'login'
         ORDER BY created_at DESC LIMIT 5`,
        [payload.id]
      );

      let matched = false;
      let matchedId = null;
      for (const row of rows.rows) {
        if (new Date(row.expires_at) < new Date()) continue;
        const ok = await bcrypt.compare(code, row.code_hash);
        if (ok) { matched = true; matchedId = row.id; break; }
      }

      if (!matched) {
        return res.status(401).json({ error: 'Invalid or expired MFA code' });
      }

      await pool.query(`UPDATE mfa_codes SET used = true WHERE id = $1`, [matchedId]);

      const r = await pool.query(
        `SELECT id, email, full_name, company, role, category,
                COALESCE(must_change_password, false) AS must_change_password,
                COALESCE(mfa_enabled, false) AS mfa_enabled
         FROM users WHERE id = $1`,
        [payload.id]
      );
      const u = r.rows[0];

      const token = jwt.sign(
        { id: u.id, email: u.email, role: u.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        ok: true,
        token,
        user: {
          id: u.id, email: u.email, full_name: u.full_name,
          company: u.company, role: u.role, category: u.category,
          must_change_password: u.must_change_password,
          mfa_enabled: u.mfa_enabled,
        },
      });

    } catch (e) {
      console.error('Verify MFA error:', e.message);
      res.status(500).json({ error: 'MFA verification failed' });
    }
  });

  /* ── POST /auth/resend-mfa ──────────────────────────────── */
  router.post('/auth/resend-mfa', async (req, res) => {
    try {
      const { mfa_session } = req.body || {};
      if (!mfa_session) return res.status(400).json({ error: 'MFA session is required' });

      let payload;
      try {
        payload = jwt.verify(mfa_session, JWT_SECRET);
      } catch (_) {
        return res.status(401).json({ error: 'MFA session expired. Please login again.' });
      }

      if (!payload.mfa_pending) return res.status(400).json({ error: 'Invalid MFA session' });

      await pool.query(
        `UPDATE mfa_codes SET used = true WHERE user_id = $1 AND user_table = 'users' AND used = false`,
        [payload.id]
      );

      const code = generateCode();
      const codeHash = await bcrypt.hash(code, 8);

      await pool.query(
        `INSERT INTO mfa_codes (user_id, user_table, code_hash, purpose, expires_at)
         VALUES ($1, 'users', $2, 'login', $3)`,
        [payload.id, codeHash, new Date(Date.now() + MFA_CODE_EXPIRY_MS)]
      );

      await sendEmail(pool, 'mfa_code', { code, contact_name: payload.email }, payload.email, 'en');

      res.json({ ok: true, message: 'New MFA code sent to your email.' });

    } catch (e) {
      console.error('Resend MFA error:', e.message);
      res.status(500).json({ error: 'Failed to resend MFA code' });
    }
  });

  /* ── GET /auth/me ───────────────────────────────────────── */
  router.get('/auth/me', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const payload = jwt.verify(token, JWT_SECRET);

      const result = await pool.query(
        `SELECT id, email, full_name, company, role, category,
                COALESCE(mfa_enabled, false) AS mfa_enabled, created_at, last_login
         FROM users WHERE id = $1 AND is_active = true LIMIT 1`,
        [payload.id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ error: 'User not found or inactive' });
      }

      res.json({ ok: true, user: result.rows[0] });

    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  /* ── POST /auth/logout ──────────────────────────────────── */
  router.post('/auth/logout', (req, res) => {
    res.json({ ok: true, message: 'Logged out successfully' });
  });

  /* ── POST /auth/forgot-password ──────────────────────────── */
  router.post('/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'Email is required' });

      // First check if the table exists
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

        await pool.query(
          `UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND user_table = 'users' AND used = false`,
          [userId]
        );

        const rawToken = generateResetToken();
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        
        const insertResult = await pool.query(
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

      const policy = validatePasswordPolicy(new_password, security);
      if (!policy.valid) {
        return res.status(400).json({ error: policy.error });
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      // First check if the table exists
      const tableCheck = await pool.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'password_reset_tokens')`
      );
      if (!tableCheck.rows[0].exists) {
        console.error('[reset-password] ERROR: password_reset_tokens table does not exist!');
        return res.status(500).json({ error: 'Password reset is not configured. Please contact support.' });
      }

      // Check all tokens for this hash (even used ones) for debugging
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
        // Give more helpful error messages
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

      const r = await pool.query(`SELECT email FROM users WHERE id = $1`, [rt.user_id]);
      const verifyEmail = r.rows[0]?.email;

      if (!verifyEmail || verifyEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ error: 'Invalid reset request' });
      }

      const hash = await bcrypt.hash(new_password, 12);

      await pool.query(
        `UPDATE users SET password_hash = $1, must_change_password = false, access_failed_count = 0, lockout_end = NULL, updated_at = NOW() WHERE id = $2`,
        [hash, rt.user_id]
      );

      await pool.query(`UPDATE password_reset_tokens SET used = true WHERE id = $1`, [rt.id]);

      res.json({ ok: true, message: 'Password has been reset successfully. You can now sign in.' });

    } catch (e) {
      console.error('Reset password error:', e.message);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  /* ── POST /auth/toggle-mfa ──────────────────────────────── */
  router.post('/auth/toggle-mfa', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const payload = jwt.verify(token, JWT_SECRET);

      const { enable } = req.body || {};
      const mfaEnabled = enable === true || enable === 'true';

      await pool.query(
        `UPDATE users SET mfa_enabled = $2, updated_at = NOW() WHERE id = $1`,
        [payload.id, mfaEnabled]
      );

      res.json({ ok: true, mfa_enabled: mfaEnabled });
    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  return router;
}
