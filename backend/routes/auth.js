import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'changeme';

export default function authRouter(pool) {
  const router = Router();

  /* ── POST /auth/register ────────────────────────────────── */
  router.post('/auth/register', async (req, res) => {
    try {
      const { username, email, password, name } = req.body || {};
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email and password are required' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      if (!/^[a-zA-Z0-9_.-]{3,64}$/.test(username)) {
        return res.status(400).json({ error: 'Username must be 3–64 characters (letters, numbers, _ . -)' });
      }

      // Check duplicates
      const existing = await pool.query(
        `SELECT id FROM portal_users WHERE lower(email) = lower($1) OR lower(username) = lower($2) LIMIT 1`,
        [email, username]
      );
      if (existing.rows.length) {
        const dup = await pool.query(
          `SELECT lower(email) AS e, lower(username) AS u FROM portal_users WHERE lower(email)=lower($1) OR lower(username)=lower($2) LIMIT 1`,
          [email, username]
        );
        const row = dup.rows[0];
        if (row.e === email.toLowerCase()) return res.status(409).json({ error: 'Email already registered' });
        return res.status(409).json({ error: 'Username already taken' });
      }

      const hash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO portal_users (username, email, password_hash, name, role)
         VALUES ($1, $2, $3, $4, 'user') RETURNING id, username, email, name, role, created_at`,
        [username.toLowerCase(), email.toLowerCase(), hash, name || username]
      );
      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ ok: true, token, user: { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role } });
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
        return res.status(400).json({ error: 'Username/email and password are required' });
      }

      const result = await pool.query(
        `SELECT id, username, email, password_hash, name, role FROM portal_users
         WHERE lower(email) = lower($1) OR lower(username) = lower($1) LIMIT 1`,
        [identifier]
      );
      if (!result.rows.length) {
        return res.status(401).json({ error: 'Invalid username/email or password' });
      }
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid username/email or password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ ok: true, token, user: { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role } });
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
      if (!token) return res.status(401).json({ error: 'No token' });
      const payload = jwt.verify(token, JWT_SECRET);
      const result = await pool.query(
        `SELECT id, username, email, name, role, created_at FROM portal_users WHERE id = $1 LIMIT 1`,
        [payload.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
      res.json({ ok: true, user: result.rows[0] });
    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  return router;
}
