import { Router } from 'express';

export default function adminAuditRouter(pool, portalAuth) {
  const router = Router();

  // List audit logs (paginated, filterable)
  router.get('/admin/audit-logs', portalAuth, async (req, res) => {
    try {
      const { entity_type, action, user_email, limit = '50', offset = '0', search } = req.query;
      const conditions = [];
      const params = [];
      let idx = 1;

      if (entity_type) { conditions.push(`entity_type = $${idx++}`); params.push(entity_type); }
      if (action) { conditions.push(`action = $${idx++}`); params.push(action); }
      if (user_email) { conditions.push(`user_email ILIKE $${idx++}`); params.push(`%${user_email}%`); }
      if (search) { conditions.push(`(action ILIKE $${idx} OR entity_type ILIKE $${idx} OR user_email ILIKE $${idx} OR entity_id::text ILIKE $${idx})`); params.push(`%${search}%`); idx++; }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      params.push(+limit, +offset);

      const [rows, countQ] = await Promise.all([
        pool.query(
          `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
          params
        ),
        pool.query(`SELECT COUNT(*) AS total FROM audit_logs ${where}`, params.slice(0, -2)),
      ]);

      res.json({ data: rows.rows, total: +countQ.rows[0].total });
    } catch (e) {
      console.error('Audit logs error:', e.message);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  });

  // Get distinct entity types and actions for filter dropdowns
  router.get('/admin/audit-logs/filters', portalAuth, async (req, res) => {
    try {
      const [entityTypes, actions] = await Promise.all([
        pool.query('SELECT DISTINCT entity_type FROM audit_logs ORDER BY entity_type'),
        pool.query('SELECT DISTINCT action FROM audit_logs ORDER BY action'),
      ]);
      res.json({
        entity_types: entityTypes.rows.map(r => r.entity_type),
        actions: actions.rows.map(r => r.action),
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch filters' });
    }
  });

  return router;
}

// Helper: insert audit log entry (for use in other route files)
export async function logAudit(pool, { userId, userEmail, action, entityType, entityId, oldValues, newValues, ipAddress }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_email, action, entity_type, entity_id, old_values, new_values, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId || null, userEmail || null, action, entityType, entityId || null,
       oldValues ? JSON.stringify(oldValues) : null,
       newValues ? JSON.stringify(newValues) : null,
       ipAddress || null]
    );
  } catch (e) {
    console.error('Audit log insert error:', e.message);
  }
}
