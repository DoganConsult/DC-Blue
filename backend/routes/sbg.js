import { Router } from 'express';

export default function sbgRouter(pool) {
  const router = Router();

  // POST /api/sbg/consultation — submit a consultation request
  router.post('/consultation', async (req, res) => {
    try {
      const { name, email, company, role, phone, objective, systems, notes } = req.body || {};

      if (!name || !email || !company) {
        return res.status(400).json({ error: 'name, email, and company are required.' });
      }

      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
      }

      const result = await pool.query(
        `INSERT INTO sbg_consultations (name, email, company, role, phone, objective, systems, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, created_at`,
        [name, email, company, role || null, phone || null, objective || null, systems || null, notes || null]
      );

      const row = result.rows[0];

      res.status(201).json({
        ok: true,
        id: row.id,
        created_at: row.created_at,
      });
    } catch (err) {
      console.error('[sbg] consultation error:', err.message);
      res.status(500).json({ error: 'Failed to save consultation request.' });
    }
  });

  // GET /api/sbg/consultations — list all (admin use, no auth for now)
  router.get('/consultations', async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM sbg_consultations ORDER BY created_at DESC LIMIT 100'
      );
      res.json(result.rows);
    } catch (err) {
      console.error('[sbg] list consultations error:', err.message);
      res.status(500).json({ error: 'Failed to fetch consultations.' });
    }
  });

  return router;
}
