import { Router } from 'express';
import {
  readAdminInbox,
  readAdminMessage,
  markAdminMessageRead,
  replyAdminMessage,
  sendAsAdmin,
  getAdminMailFolders,
  readMailboxInbox,
  readMailboxMessage,
  markMailboxMessageRead,
  replyMailboxMessage,
  getMailboxFolders,
  sendFromMailbox,
  getUnreadCount,
  MSGRAPH_ADMIN_EMAIL,
  MSGRAPH_SENDER,
} from '../services/email.js';

const VALID_ACCOUNTS = ['platform', 'admin'];
function resolveAccount(req) {
  const a = req.query.account || req.body?.account || 'admin';
  return VALID_ACCOUNTS.includes(a) ? a : 'admin';
}

export default function adminMailRouter(pool, portalAuth, adminOnly) {
  const router = Router();

  router.get('/admin/mail/config', portalAuth, adminOnly, (req, res) => {
    res.json({
      ok: true,
      accounts: {
        platform: { email: MSGRAPH_SENDER, role: 'Default sender — notifications, password reset, MFA, alerts' },
        admin: { email: MSGRAPH_ADMIN_EMAIL, role: 'Admin mailbox — receives, reads, replies, ticketing' },
      },
    });
  });

  router.get('/admin/mail/unread', portalAuth, adminOnly, async (req, res) => {
    try {
      const [platform, admin] = await Promise.all([
        getUnreadCount('platform'),
        getUnreadCount('admin'),
      ]);
      res.json({ ok: true, platform, admin });
    } catch (e) {
      console.error('Mail unread error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.get('/admin/mail/folders', portalAuth, adminOnly, async (req, res) => {
    try {
      const account = resolveAccount(req);
      const result = await getMailboxFolders(account);
      res.json(result);
    } catch (e) {
      console.error('Mail folders error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.get('/admin/mail/inbox', portalAuth, adminOnly, async (req, res) => {
    try {
      const account = resolveAccount(req);
      const { folder = 'inbox', top = 20, skip = 0, filter = '' } = req.query;
      const result = await readMailboxInbox(account, folder, +top, +skip, filter);
      res.json(result);
    } catch (e) {
      console.error('Mail inbox error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.get('/admin/mail/messages/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const account = resolveAccount(req);
      const result = await readMailboxMessage(account, req.params.id);
      res.json(result);
    } catch (e) {
      console.error('Mail read error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.patch('/admin/mail/messages/:id/read', portalAuth, adminOnly, async (req, res) => {
    try {
      const account = resolveAccount(req);
      const { isRead = true } = req.body || {};
      const result = await markMailboxMessageRead(account, req.params.id, isRead);
      res.json(result);
    } catch (e) {
      console.error('Mail mark-read error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.post('/admin/mail/messages/:id/reply', portalAuth, adminOnly, async (req, res) => {
    try {
      const account = resolveAccount(req);
      const { body: htmlBody } = req.body || {};
      if (!htmlBody) return res.status(400).json({ ok: false, error: 'Reply body is required' });
      const result = await replyMailboxMessage(account, req.params.id, htmlBody);

      if (pool) {
        try {
          const acctEmail = account === 'platform' ? MSGRAPH_SENDER : MSGRAPH_ADMIN_EMAIL;
          await pool.query(
            `INSERT INTO email_log (recipient, template, subject, status) VALUES ($1, 'mail_reply', $2, 'sent')`,
            [acctEmail, `Reply to message ${req.params.id}`]
          );
        } catch (_) {}
      }

      res.json(result);
    } catch (e) {
      console.error('Mail reply error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  router.post('/admin/mail/send', portalAuth, adminOnly, async (req, res) => {
    try {
      const { to, subject, body: htmlBody, account = 'admin' } = req.body || {};
      if (!to || !subject || !htmlBody) {
        return res.status(400).json({ ok: false, error: 'to, subject, and body are required' });
      }
      const safeAccount = VALID_ACCOUNTS.includes(account) ? account : 'admin';
      const result = await sendFromMailbox(safeAccount, to, subject, htmlBody);

      if (pool) {
        try {
          await pool.query(
            `INSERT INTO email_log (recipient, template, subject, status) VALUES ($1, 'mail_send', $2, 'sent')`,
            [to, subject]
          );
        } catch (_) {}
      }

      res.json(result);
    } catch (e) {
      console.error('Mail send error:', e.message);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  return router;
}
