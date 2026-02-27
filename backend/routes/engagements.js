import { Router } from 'express';

export default function engagementsRouter(pool, portalAuth) {
  const router = Router();

  router.get('/engagements', portalAuth, async (req, res) => {
    try {
      const { phase, owner, page = 1, limit = 50 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;
      let where = [];
      let params = [];
      let idx = 1;
      if (phase) { where.push(`e.phase = $${idx++}`); params.push(phase); }
      if (owner) { where.push(`e.owner = $${idx++}`); params.push(owner); }
      const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const countQ = await pool.query(`SELECT count(*) FROM engagements e ${clause}`, params);
      params.push(+limit, offset);
      const rows = await pool.query(
        `SELECT e.*, o.title AS opportunity_title, li.company_name, li.ticket_number
         FROM engagements e
         LEFT JOIN opportunities o ON o.id = e.opportunity_id
         LEFT JOIN lead_intakes li ON li.id = e.lead_intake_id
         ${clause}
         ORDER BY e.updated_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );
      res.json({ total: +countQ.rows[0].count, page: +page, data: rows.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch engagements' });
    }
  });

  router.get('/engagements/:id', portalAuth, async (req, res) => {
    try {
      const eng = await pool.query('SELECT * FROM engagements WHERE id = $1', [req.params.id]);
      if (!eng.rows.length) return res.status(404).json({ error: 'Engagement not found' });
      const checklist = await pool.query(
        'SELECT * FROM engagement_checklist_items WHERE engagement_id = $1 ORDER BY created_at ASC',
        [req.params.id]
      );
      res.json({ engagement: eng.rows[0], checklist: checklist.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch engagement' });
    }
  });

  router.post('/engagements', portalAuth, async (req, res) => {
    try {
      const b = req.body || {};
      if (!b.opportunity_id) return res.status(400).json({ error: 'opportunity_id required' });
      const opp = await pool.query(
        'SELECT id, lead_intake_id, title FROM opportunities WHERE id = $1',
        [b.opportunity_id]
      );
      if (!opp.rows.length) return res.status(404).json({ error: 'Opportunity not found' });

      const result = await pool.query(
        `INSERT INTO engagements (opportunity_id, lead_intake_id, title, owner, activity_code, country_code, scope_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          b.opportunity_id,
          opp.rows[0].lead_intake_id,
          b.title || opp.rows[0].title + ' — Engagement',
          b.owner || null,
          b.activity_code || null,
          b.country_code || 'SA',
          b.scope_notes || null,
        ]
      );

      const eng = result.rows[0];
      const checklistItems = [];
      if (b.activity_code && b.country_code) {
        const { getMatrixEntry } = await import('../services/regulatory-matrix.js');
        const entry = getMatrixEntry(b.activity_code, b.country_code);
        if (entry) {
          for (const p of entry.permits || []) {
            checklistItems.push({ category: 'permit', label: `${p.type}${p.renewal === 'annual' ? ' (annual renewal)' : ''}` });
          }
          for (const t of entry.controlThemes || []) {
            checklistItems.push({ category: 'control', label: `Evidence for: ${t}` });
          }
          for (const f of entry.frameworks || []) {
            checklistItems.push({ category: 'framework', label: `${f.nameEn} alignment documented` });
          }
        }
      }
      checklistItems.push({ category: 'delivery', label: 'Deliverables completed' });
      checklistItems.push({ category: 'delivery', label: 'Client sign-off obtained' });
      checklistItems.push({ category: 'delivery', label: 'Final report submitted' });

      for (const item of checklistItems) {
        await pool.query(
          `INSERT INTO engagement_checklist_items (engagement_id, category, label)
           VALUES ($1, $2, $3)`,
          [eng.id, item.category, item.label]
        );
      }

      res.status(201).json({ ok: true, engagement: eng });
    } catch (e) {
      console.error('Create engagement error:', e.message);
      res.status(500).json({ error: 'Failed to create engagement' });
    }
  });

  router.patch('/engagements/:id', portalAuth, async (req, res) => {
    try {
      const b = req.body || {};
      const allowed = ['phase', 'owner', 'scope_notes', 'closed_at'];
      const sets = [];
      const params = [];
      let idx = 1;
      for (const k of allowed) {
        if (b[k] !== undefined) {
          sets.push(`${k} = $${idx++}`);
          params.push(k === 'closed_at' && b[k] === true ? new Date() : b[k]);
        }
      }
      if (!sets.length) return res.status(400).json({ error: 'No valid fields' });
      sets.push('updated_at = now()');
      params.push(req.params.id);
      await pool.query(`UPDATE engagements SET ${sets.join(', ')} WHERE id = $${idx}`, params);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update engagement' });
    }
  });

  router.patch('/engagements/:engId/checklist/:itemId', portalAuth, async (req, res) => {
    try {
      const { checked } = req.body;
      await pool.query(
        `UPDATE engagement_checklist_items
         SET checked = $1, checked_by = $2, checked_at = CASE WHEN $1 THEN now() ELSE NULL END
         WHERE id = $3 AND engagement_id = $4`,
        [!!checked, req.body.checked_by || 'admin', req.params.itemId, req.params.engId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update checklist item' });
    }
  });

  return router;
}
