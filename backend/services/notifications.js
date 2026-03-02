/**
 * Partner Notification Service
 * Event-driven notifications + SSE broadcast
 */
import { sendRawEmail } from './email.js';

// Global SSE client registry: Map<partnerId, Set<Response>>
if (!global._partnerSSEClients) {
  global._partnerSSEClients = new Map();
}

/**
 * Send a real-time SSE event to a connected partner
 */
export function broadcastToPartner(partnerId, eventType, data) {
  const clients = global._partnerSSEClients.get(partnerId);
  if (!clients || clients.size === 0) return;
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch (_) {}
  }
}

/**
 * Create a notification for a partner + optional email + SSE broadcast
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} partnerId - Partner UUID
 * @param {Object} opts - { type, title, body, link }
 *   type: 'info' | 'commission' | 'pipeline' | 'sla' | 'system' | 'achievement' | 'message'
 */
export async function notifyPartner(pool, partnerId, { type, title, body, link }) {
  try {
    // 1. Insert notification
    const result = await pool.query(
      `INSERT INTO partner_notifications (partner_id, type, title, body, link)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [partnerId, type, title, body || '', link || '']
    );
    const notif = result.rows[0];

    // 2. Broadcast via SSE
    broadcastToPartner(partnerId, 'notification', {
      id: notif.id,
      type,
      title,
      body,
      link,
      created_at: notif.created_at,
    });

    // 3. Email for high-priority types (based on preferences)
    const PREF_MAP = {
      commission: 'commission_alerts',
      sla: 'sla_warnings',
      pipeline: 'pipeline_updates',
      message: 'message_alerts',
    };

    const prefCol = PREF_MAP[type];
    if (prefCol) {
      const prefResult = await pool.query(
        `SELECT p.contact_email, ep.${prefCol} AS pref_enabled
         FROM partners p
         LEFT JOIN partner_email_preferences ep ON ep.partner_id = p.id
         WHERE p.id = $1`,
        [partnerId]
      );
      const row = prefResult.rows[0];
      // Send email if preference is enabled or not yet set (null = default on)
      if (row?.contact_email && (row.pref_enabled === true || row.pref_enabled === null)) {
        const html = `
          <div style="font-family:'IBM Plex Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <div style="background:#0f62fe;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
              <h2 style="margin:0;font-size:18px;">${title}</h2>
            </div>
            <div style="background:#fff;border:1px solid #e0e0e0;padding:24px;border-radius:0 0 8px 8px;">
              <p style="color:#525252;font-size:14px;line-height:1.6;">${body || ''}</p>
              ${link ? `<a href="${process.env.APP_URL || 'https://www.doganconsult.com'}${link}" style="display:inline-block;margin-top:16px;padding:10px 24px;background:#0f62fe;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;">View Details</a>` : ''}
            </div>
          </div>`;
        await sendRawEmail(pool, row.contact_email, `[Dogan Consult] ${title}`, html).catch(() => {});
      }
    }

    return notif.id;
  } catch (e) {
    console.error('notifyPartner error:', e.message);
    return null;
  }
}

export default { notifyPartner, broadcastToPartner };
