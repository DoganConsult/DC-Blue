import { Router } from 'express';

export default function gatesRouter(pool, portalAuth) {
  const router = Router();

  router.get('/opportunities/:id/gates', portalAuth, async (req, res) => {
    try {
      const oppId = req.params.id;
      const opp = await pool.query('SELECT id, stage FROM opportunities WHERE id = $1', [oppId]);
      if (!opp.rows.length) return res.status(404).json({ error: 'Opportunity not found' });

      let items = await pool.query(
        `SELECT * FROM gate_checklist_items WHERE opportunity_id = $1 ORDER BY stage, created_at ASC`,
        [oppId]
      );

      if (items.rows.length === 0) {
        const defs = await pool.query(
          'SELECT * FROM gate_definitions ORDER BY stage, display_order ASC'
        );
        for (const d of defs.rows) {
          await pool.query(
            `INSERT INTO gate_checklist_items (opportunity_id, gate_def_id, stage, item_key, label)
             VALUES ($1, $2, $3, $4, $5)`,
            [oppId, d.id, d.stage, d.item_key, d.label_en]
          );
        }
        items = await pool.query(
          `SELECT * FROM gate_checklist_items WHERE opportunity_id = $1 ORDER BY stage, created_at ASC`,
          [oppId]
        );
      }

      const grouped = {};
      for (const item of items.rows) {
        if (!grouped[item.stage]) grouped[item.stage] = [];
        grouped[item.stage].push(item);
      }

      const currentStage = opp.rows[0].stage;
      const currentItems = grouped[currentStage] || [];
      const allChecked = currentItems.length > 0 && currentItems.filter(i => i.required !== false).every(i => i.checked);

      res.json({
        opportunity_stage: currentStage,
        gates: grouped,
        current_gate_complete: allChecked,
        can_advance: allChecked,
      });
    } catch (e) {
      console.error('Get gates error:', e.message);
      res.status(500).json({ error: 'Failed to fetch gates' });
    }
  });

  router.patch('/opportunities/:oppId/gates/:itemId', portalAuth, async (req, res) => {
    try {
      const { checked } = req.body;
      await pool.query(
        `UPDATE gate_checklist_items
         SET checked = $1, checked_by = $2, checked_at = CASE WHEN $1 THEN now() ELSE NULL END
         WHERE id = $3 AND opportunity_id = $4`,
        [!!checked, req.body.checked_by || 'admin', req.params.itemId, req.params.oppId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update gate item' });
    }
  });

  router.get('/gate-definitions', portalAuth, async (req, res) => {
    try {
      const rows = await pool.query('SELECT * FROM gate_definitions ORDER BY stage, display_order ASC');
      res.json({ data: rows.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch gate definitions' });
    }
  });

  return router;
}
