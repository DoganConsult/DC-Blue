import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { calculateLeadScore } from '../services/scoring.js';
import { sendEmail, sendInternalAlert } from '../services/email.js';
import { notifyPartner } from '../services/notifications.js';
import { logAudit } from './admin-audit.js';
import { getJwtSecret } from '../config/jwt.js';

/** Used only for legacy password-only login and setup token validation (not for JWT). */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

/** Portal auth: Bearer JWT only. Sets req.portalUser = { id?, email?, role }. */
export function portalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearer = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!bearer) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(bearer, getJwtSecret());
    req.portalUser = { id: payload.id, email: payload.email, role: payload.role || 'employee' };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

/** Require admin role (use after portalAuth). */
export function adminOnly(req, res, next) {
  if (req.portalUser && req.portalUser.role === 'admin') return next();
  return res.status(403).json({ error: 'Forbidden' });
}

/** Optional auth: if Bearer JWT present & valid, sets req.portalUser. Otherwise continues without error. */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearer = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!bearer) { req.portalUser = null; return next(); }
  try {
    const payload = jwt.verify(bearer, getJwtSecret());
    req.portalUser = { id: payload.id, email: payload.email, role: payload.role || 'employee' };
  } catch (e) {
    req.portalUser = null;
  }
  next();
}

export default function leadsRouter(pool) {
  const router = Router();

  /* ── helpers ─────────────────────────────────────────── */
  function dedupeHash(email, company) {
    return crypto
      .createHash('sha256')
      .update(`${(email || '').toLowerCase().trim()}|${(company || '').toLowerCase().trim()}`)
      .digest('hex')
      .slice(0, 64);
  }

  function genTicket() {
    const d = new Date();
    const prefix = `DC${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${rand}`;
  }

  /** KSA CR activities — single source for partner portal, finance, platform setup, sheets. */
  const KSA_CR_ACTIVITIES = [
    { code: '410010', nameAr: 'الإنشاءات العامة للمباني السكنية', nameEn: 'General construction for residential buildings' },
    { code: '410021', nameAr: 'الإنشاءات العامة للمباني غير السكنية (مثل المدارس والمستشفيات والفنادق .... الخ)', nameEn: 'General construction for non-residential buildings (e.g. schools, hospitals, hotels)' },
    { code: '410030', nameAr: 'إنشاءات المباني الجاهزة في المواقع', nameEn: 'Construction of prefabricated buildings on sites' },
    { code: '410040', nameAr: 'ترميمات المباني السكنية والغير سكنية', nameEn: 'Renovations of residential and non-residential buildings' },
    { code: '582001', nameAr: 'نشر البرامج الجاهزة', nameEn: 'Publishing of ready-made software' },
    { code: '582002', nameAr: 'أنظمة التشغيل', nameEn: 'Operating systems' },
    { code: '620101', nameAr: 'تكامل الأنظمة', nameEn: 'Systems integration' },
    { code: '620102', nameAr: 'تصميم وبرمجة البرمجيات الخاصة', nameEn: 'Design and programming of special software' },
    { code: '620106', nameAr: 'تقنيات الروبوت', nameEn: 'Robotics technologies' },
    { code: '620108', nameAr: 'تقنيات الواقع الاندماجي (الواقع الافتراضي والمعزز)', nameEn: 'Immersive reality technologies (virtual and augmented reality)' },
    { code: '620111', nameAr: 'تطوير التطبيقات', nameEn: 'Application development' },
    { code: '620113', nameAr: 'تقنيات الذكاء الاصطناعي', nameEn: 'Artificial intelligence technologies' },
    { code: '620211', nameAr: 'تقديم خدمة إدارة ومراقبة شبكات الاتصالات والمعلومات', nameEn: 'Communication and information network management and monitoring services' },
    { code: '631121', nameAr: 'إقامة البنية الأساسية لاستضافة المواقع على الشبكة وخدمات تجهيز البيانات والأنشطة المتصلة بذلك', nameEn: 'Infrastructure for hosting websites and data processing services and related activities' },
    { code: '631125', nameAr: 'تقديم خدمات الحوسبة السحابية', nameEn: 'Cloud computing services' },
    { code: '702017', nameAr: 'تقديم خدمات الاستشارات الإدارية العليا', nameEn: 'Senior management consulting services' },
    { code: '731013', nameAr: 'تقديم خدمات تسويقية نيابة عن الغير', nameEn: 'Marketing services on behalf of others' },
  ];

  router.get('/public/cr-activities', (_req, res) => {
    res.json({ data: KSA_CR_ACTIVITIES });
  });

  /** POST /api/v1/public/contact — short contact form → lead_intakes (source=website_contact) */
  router.post('/public/contact', async (req, res) => {
    try {
      const { name, email, company, message } = req.body || {};
      if (!(email && String(email).trim())) return res.status(400).json({ error: 'Email required' });
      const companyName = (company && String(company).trim()) || '—';
      const contactName = (name && String(name).trim()) || '—';
      const msg = (message && String(message).trim()) || null;
      const hash = dedupeHash(email.trim(), companyName);
      const ticket = genTicket();
      const assignTo = 'sales@doganconsult.com';
      const score = calculateLeadScore({ contact_email: email, company_name: companyName, contact_name: contactName, message: msg });

      const result = await pool.query(
        `INSERT INTO lead_intakes (
          source, company_name, contact_name, contact_email, message,
          dedupe_hash, ticket_number, assigned_to, score, consent_pdpl
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING id, ticket_number, created_at`,
        ['website_contact', companyName, contactName, email.trim().toLowerCase(), msg, hash, ticket, assignTo, score, true]
      );
      res.status(201).json({ ok: true, ticket_number: result.rows[0].ticket_number });
    } catch (e) {
      console.error('Contact form error:', e.message);
      res.status(500).json({ error: 'Failed to save' });
    }
  });

  /* ── PUBLIC: submit inquiry ──────────────────────────── */
  router.post('/public/inquiries', optionalAuth, async (req, res) => {
    try {
      const b = req.body || {};
      if (!b.contact_email?.trim()) return res.status(400).json({ error: 'Email is required / البريد الإلكتروني مطلوب' });
      if (!b.company_name?.trim()) return res.status(400).json({ error: 'Company name is required / اسم الشركة مطلوب' });
      if (!b.consent_pdpl) return res.status(400).json({ error: 'PDPL consent required / الموافقة على حماية البيانات مطلوبة' });

      const lang = (b.lang || b.language || 'en') === 'ar' ? 'ar' : 'en';
      const score = calculateLeadScore(b);

      const hash = dedupeHash(b.contact_email, b.company_name);
      const ticket = genTicket();

      // check duplicate within 30 days
      const dup = await pool.query(
        `SELECT id, ticket_number FROM lead_intakes WHERE dedupe_hash = $1 AND created_at > now() - interval '30 days' LIMIT 1`,
        [hash]
      );
      if (dup.rows.length > 0) {
        return res.status(409).json({
          error: 'A similar inquiry was already submitted recently.',
          error_ar: 'تم تقديم استفسار مماثل مؤخراً.',
          existing_ticket: dup.rows[0].ticket_number,
        });
      }

      // auto-assign
      const rule = await pool.query(
        `SELECT assign_to FROM lead_assign_rules WHERE active = true
         AND (product_line IS NULL OR product_line = $1)
         AND (vertical IS NULL OR vertical = $2)
         AND (city IS NULL OR city = $3)
         ORDER BY priority ASC LIMIT 1`,
        [b.product_line || null, b.vertical || null, b.city || null]
      );
      const assignTo = rule.rows.length > 0 ? rule.rows[0].assign_to : 'sales@doganconsult.com';

      let result;
      try {
        const userId = req.portalUser?.id || null;
        result = await pool.query(
          `INSERT INTO lead_intakes (
            source, campaign_tag, product_line, vertical,
            company_name, cr_number, company_website, city, country, address_line,
            contact_name, contact_title, contact_email, contact_phone, contact_department,
            expected_users, budget_range, timeline, message,
            company_size, expected_decision_date, conditions_notes,
            consent_pdpl, dedupe_hash, ticket_number, assigned_to, score, user_id
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28
          ) RETURNING id, ticket_number, created_at`,
          [
            b.source || 'website', b.campaign_tag || null, b.product_line || null, b.vertical || null,
            b.company_name.trim(), b.cr_number || null, b.company_website || null, b.city || null, b.country || 'SA', (b.address_line || '').trim() || null,
            b.contact_name?.trim() || '—', b.contact_title || null, b.contact_email.trim().toLowerCase(),
            b.contact_phone || null, b.contact_department || null,
            b.expected_users || null, b.budget_range || null, b.timeline || null, b.message?.trim() || null,
            b.company_size || null, b.expected_decision_date || null, (b.conditions_notes || '').trim() || null,
            true, hash, ticket, assignTo, score, userId,
          ]
        );
      } catch (e) {
        if (e && e.code === '42703') {
          result = await pool.query(
            `INSERT INTO lead_intakes (
              source, campaign_tag, product_line, vertical,
              company_name, cr_number, company_website, city, country, address_line,
              contact_name, contact_title, contact_email, contact_phone,
              expected_users, budget_range, timeline, message,
              company_size, expected_decision_date, conditions_notes,
              consent_pdpl, dedupe_hash, ticket_number, assigned_to, score, user_id
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
            ) RETURNING id, ticket_number, created_at`,
            [
              b.source || 'website', b.campaign_tag || null, b.product_line || null, b.vertical || null,
              b.company_name.trim(), b.cr_number || null, b.company_website || null, b.city || null, b.country || 'SA', (b.address_line || '').trim() || null,
              b.contact_name?.trim() || '—', b.contact_title || null, b.contact_email.trim().toLowerCase(),
              b.contact_phone || null,
              b.expected_users || null, b.budget_range || null, b.timeline || null, b.message?.trim() || null,
              b.company_size || null, b.expected_decision_date || null, (b.conditions_notes || '').trim() || null,
              true, hash, ticket, assignTo, score, userId,
            ]
          );
        } else {
          throw e;
        }
      }

      // auto-activity
      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'system', $2, 'system')`,
        [result.rows[0].id, `Lead submitted from ${b.source || 'website'}. Assigned to ${assignTo}.`]
      );

      try {
        await sendEmail(pool, 'inquiry_confirmation', {
          entity_type: 'lead_intakes',
          entity_id: result.rows[0].id,
          ticket_number: result.rows[0].ticket_number,
          company_name: b.company_name.trim(),
          contact_name: b.contact_name?.trim() || null,
          contact_email: b.contact_email.trim().toLowerCase(),
          product_line: b.product_line || null,
        }, b.contact_email.trim().toLowerCase(), lang);

        await sendInternalAlert(pool, 'internal_new_lead', {
          entity_type: 'lead_intakes',
          entity_id: result.rows[0].id,
          ticket_number: result.rows[0].ticket_number,
          company_name: b.company_name.trim(),
          contact_name: b.contact_name?.trim() || '—',
          contact_email: b.contact_email.trim().toLowerCase(),
          product_line: b.product_line || null,
          score,
          assigned_to: assignTo,
          admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin/leads/${result.rows[0].id}`,
        });
      } catch (_) {}

      res.status(201).json({
        ok: true,
        ticket_number: result.rows[0].ticket_number,
        message: 'Inquiry received successfully',
        message_ar: 'تم استلام الاستفسار بنجاح',
      });
    } catch (e) {
      console.error('Inquiry submission error:', e.message);
      res.status(500).json({ error: 'Failed to submit inquiry' });
    }
  });

  /* ── PUBLIC: ticket tracking ──────────────────────────── */
  router.get('/public/track/:ticket', async (req, res) => {
    try {
      const row = await pool.query(
        `SELECT ticket_number, status, company_name, contact_name, product_line, created_at, updated_at
         FROM lead_intakes WHERE ticket_number = $1`,
        [req.params.ticket.trim().toUpperCase()]
      );
      if (!row.rows.length) return res.status(404).json({ error: 'Ticket not found' });
      const l = row.rows[0];
      res.json({
        ticket_number: l.ticket_number,
        status: l.status,
        company_name: l.company_name,
        contact_name: l.contact_name,
        product_line: l.product_line,
        submitted_at: l.created_at,
        last_updated: l.updated_at,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to look up ticket' });
    }
  });

  /* ── ADMIN: login/MFA consolidated — uses /api/v1/auth/* from auth.js ── */
  /* (Removed duplicate /admin/login and /admin/resend-mfa — now using consolidated auth routes) */

  /* ── ADMIN: registration management ──────────────────────────────────── */
  router.get('/admin/registrations', portalAuth, adminOnly, async (req, res) => {
    try {
      const { status, page = 1, limit = 25 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      let where = `WHERE role NOT IN ('admin', 'employee')`;
      const params = [];
      if (status) { params.push(status); where += ` AND approval_status = $${params.length}`; }
      const countR = await pool.query(`SELECT COUNT(*) AS cnt FROM users ${where}`, params);
      params.push(Number(limit), offset);
      const dataR = await pool.query(
        `SELECT id, email, full_name, company, role, category, approval_status, is_active, created_at
         FROM users ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params
      );
      res.json({ data: dataR.rows, total: Number(countR.rows[0].cnt) });
    } catch (e) {
      console.error('Registrations list error:', e.message);
      res.status(500).json({ error: 'Failed to load registrations' });
    }
  });

  router.patch('/admin/registrations/:id/approve', portalAuth, adminOnly, async (req, res) => {
    try {
      await pool.query(
        `UPDATE users SET approval_status = 'approved', approved_by = $2, approved_at = NOW(), is_active = true WHERE id = $1`,
        [req.params.id, req.portalUser.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to approve' });
    }
  });

  router.patch('/admin/registrations/:id/reject', portalAuth, adminOnly, async (req, res) => {
    try {
      await pool.query(
        `UPDATE users SET approval_status = 'rejected', is_active = false WHERE id = $1`,
        [req.params.id]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to reject' });
    }
  });

  /* ── ADMIN: create team member (admin-only, @doganconsult.com only) ────── */
  router.post('/admin/users', portalAuth, adminOnly, async (req, res) => {
    try {
      const { email, password, name, role } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      if (password.length < 12) {
        return res.status(400).json({ error: 'Password must be at least 12 characters' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain !== 'doganconsult.com') {
        return res.status(400).json({ error: 'Team members must use @doganconsult.com email' });
      }
      const safeRole = role === 'admin' ? 'admin' : 'employee';
      const existing = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
        [email.trim()]
      );
      if (existing.rows.length) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const hash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role, category, is_active, must_change_password, mfa_enabled, created_by)
         VALUES ($1, $2, $3, $4, 'employee', true, true, true, $5)
         RETURNING id, email, role, full_name, category, must_change_password, created_at`,
        [
          email.trim().toLowerCase(),
          hash,
          (name || '').trim() || email.split('@')[0],
          safeRole,
          req.portalUser.id || null,
        ]
      );
      res.status(201).json({ ok: true, user: result.rows[0] });
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
      console.error('Create team member error:', e.message);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  /* ── ADMIN: list team members (admin-only) ────────────────────────────── */
  router.get('/admin/users', portalAuth, adminOnly, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, email, role, full_name, category, must_change_password, created_at
         FROM users WHERE role IN ('admin','employee') OR category = 'employee'
         ORDER BY created_at DESC`
      );
      res.json({ ok: true, data: result.rows });
    } catch (e) {
      console.error('List team members error:', e.message);
      res.status(500).json({ error: 'Failed to list users' });
    }
  });

  /* ── AUTH: change password (own account, used for first-login force change) */
  router.post('/admin/change-password', portalAuth, async (req, res) => {
    try {
      const { current_password, new_password } = req.body || {};
      if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }
      if (new_password.length < 12) {
        return res.status(400).json({ error: 'New password must be at least 12 characters' });
      }
      const u = await pool.query(
        'SELECT id, password_hash FROM users WHERE id = $1',
        [req.portalUser.id]
      );
      if (!u.rows.length) return res.status(404).json({ error: 'User not found' });
      const match = await bcrypt.compare(current_password, u.rows[0].password_hash);
      if (!match) return res.status(401).json({ error: 'Current password is incorrect' });
      if (current_password === new_password) {
        return res.status(400).json({ error: 'New password must be different from current password' });
      }
      const hash = await bcrypt.hash(new_password, 12);
      await pool.query(
        'UPDATE users SET password_hash = $1, must_change_password = false, updated_at = NOW() WHERE id = $2',
        [hash, req.portalUser.id]
      );
      const token = jwt.sign(
        { id: req.portalUser.id, email: req.portalUser.email, role: req.portalUser.role },
        getJwtSecret(),
        { expiresIn: '7d' }
      );
      res.json({ ok: true, token });
    } catch (e) {
      console.error('Change password error:', e.message);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  /* ── INTERNAL: list leads ────────────────────────────── */
  router.get('/leads', portalAuth, async (req, res) => {
    try {
      const { status, product_line, search, page = 1, limit = 25 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;
      let where = [];
      let params = [];
      let idx = 1;

      if (status) { where.push(`status = $${idx++}`); params.push(status); }
      if (product_line) { where.push(`product_line = $${idx++}`); params.push(product_line); }
      if (search) {
        where.push(`(contact_name ILIKE $${idx} OR contact_email ILIKE $${idx} OR company_name ILIKE $${idx})`);
        params.push(`%${search}%`);
        idx++;
      }

      const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const countQ = await pool.query(`SELECT count(*) FROM lead_intakes ${clause}`, params);
      const total = +countQ.rows[0].count;

      params.push(+limit, offset);
      const rows = await pool.query(
        `SELECT id, ticket_number, status, company_name, contact_name, contact_email,
                product_line, vertical, city, country, address_line, company_size, expected_decision_date,
                score, assigned_to, created_at
         FROM lead_intakes ${clause}
         ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );

      res.json({ total, page: +page, limit: +limit, data: rows.rows });
    } catch (e) {
      console.error('List leads error:', e.message);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  /* ── INTERNAL: single lead detail + activities ──────── */
  router.get('/leads/:id', portalAuth, async (req, res) => {
    try {
      const lead = await pool.query('SELECT * FROM lead_intakes WHERE id = $1', [req.params.id]);
      if (!lead.rows.length) return res.status(404).json({ error: 'Lead not found' });

      const activities = await pool.query(
        'SELECT * FROM lead_activities WHERE lead_intake_id = $1 ORDER BY created_at DESC',
        [req.params.id]
      );

      const opps = await pool.query(
        'SELECT * FROM opportunities WHERE lead_intake_id = $1 ORDER BY created_at DESC',
        [req.params.id]
      );

      const partnerLead = await pool.query(
        `SELECT pl.id AS partner_lead_id, pl.status AS partner_lead_status, pl.approved_at, pl.rejected_reason, p.company_name AS partner_company_name
         FROM partner_leads pl
         JOIN partners p ON p.id = pl.partner_id
         WHERE pl.lead_intake_id = $1
         ORDER BY pl.created_at DESC LIMIT 1`,
        [req.params.id]
      );

      res.json({
        lead: lead.rows[0],
        activities: activities.rows,
        opportunities: opps.rows,
        partner_lead: partnerLead.rows[0] || null,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch lead' });
    }
  });

  /* ── INTERNAL: update lead ──────────────────────────── */
  router.patch('/leads/:id', portalAuth, async (req, res) => {
    try {
      const b = req.body || {};
      const allowed = ['status', 'assigned_to', 'score', 'product_line', 'vertical', 'address_line', 'company_size', 'expected_decision_date', 'conditions_notes'];
      const sets = [];
      const params = [];
      let idx = 1;

      for (const k of allowed) {
        if (b[k] !== undefined) {
          sets.push(`${k} = $${idx++}`);
          params.push(b[k]);
        }
      }
      if (!sets.length) return res.status(400).json({ error: 'No valid fields to update' });

      sets.push(`updated_at = now()`);
      params.push(req.params.id);

      await pool.query(`UPDATE lead_intakes SET ${sets.join(', ')} WHERE id = $${idx}`, params);

      // log activity (partner-visible so they see status updates)
      const changes = Object.keys(b).filter(k => allowed.includes(k)).map(k => `${k} → ${b[k]}`).join(', ');
      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by, visibility) VALUES ($1, 'status_change', $2, $3, 'partner')`,
        [req.params.id, changes, b.updated_by || 'admin']
      );

      logAudit(pool, { userEmail: req.user?.email, action: 'lead_update', entityType: 'lead', entityId: req.params.id, newValues: b, ipAddress: req.ip });

      // Notify associated partner about status change
      const pr = await pool.query(
        `SELECT pl.partner_id, li.company_name, li.ticket_number
         FROM partner_leads pl JOIN lead_intakes li ON li.id = pl.lead_intake_id
         WHERE pl.lead_intake_id = $1 LIMIT 1`,
        [req.params.id]
      ).catch(() => ({ rows: [] }));
      if (pr.rows.length) {
        await notifyPartner(pool, pr.rows[0].partner_id, {
          type: 'pipeline',
          title: `Lead ${pr.rows[0].ticket_number} updated`,
          body: `${pr.rows[0].company_name}: ${changes}`,
          link: '/partner?tab=activity',
        }).catch(e => console.error('Lead notification:', e.message));
      }

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update lead' });
    }
  });

  /* ── INTERNAL: add activity ─────────────────────────── */
  router.post('/leads/:id/activities', portalAuth, async (req, res) => {
    try {
      const { type = 'note', body, created_by = 'admin', visibility = 'internal' } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: 'Body required' });
      const safeVisibility = ['internal', 'partner'].includes(visibility) ? visibility : 'internal';

      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by, visibility) VALUES ($1, $2, $3, $4, $5)`,
        [req.params.id, type, body.trim(), created_by, safeVisibility]
      );

      // If partner-visible, notify associated partner
      if (safeVisibility === 'partner') {
        const pr = await pool.query(
          `SELECT pl.partner_id, li.company_name, li.ticket_number
           FROM partner_leads pl JOIN lead_intakes li ON li.id = pl.lead_intake_id
           WHERE pl.lead_intake_id = $1 LIMIT 1`,
          [req.params.id]
        );
        if (pr.rows.length) {
          await notifyPartner(pool, pr.rows[0].partner_id, {
            type: 'pipeline',
            title: `Update on ${pr.rows[0].company_name}`,
            body: body.trim().substring(0, 200),
            link: '/partner?tab=activity',
          }).catch(e => console.error('Lead notification:', e.message));
        }
      }

      res.status(201).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to add activity' });
    }
  });

  /* ── INTERNAL: convert to opportunity ───────────────── */
  router.post('/leads/:id/convert', portalAuth, async (req, res) => {
    try {
      const lead = await pool.query('SELECT * FROM lead_intakes WHERE id = $1', [req.params.id]);
      if (!lead.rows.length) return res.status(404).json({ error: 'Lead not found' });

      const l = lead.rows[0];
      const b = req.body || {};

      const opp = await pool.query(
        `INSERT INTO opportunities (lead_intake_id, title, stage, owner, estimated_value, currency, probability)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          l.id,
          b.title || `${l.company_name} — ${l.product_line || 'General'}`,
          'discovery', l.assigned_to,
          b.estimated_value || 0, b.currency || 'SAR', b.probability || 20,
        ]
      );

      await pool.query(`UPDATE lead_intakes SET status = 'won', converted_at = now(), updated_at = now() WHERE id = $1`, [l.id]);

      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'system', $2, $3)`,
        [l.id, `Converted to opportunity ${opp.rows[0].id}`, b.created_by || 'admin']
      );

      res.status(201).json({ ok: true, opportunity_id: opp.rows[0].id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to convert lead' });
    }
  });

  /* ── INTERNAL: dashboard stats ──────────────────────── */
  router.get('/dashboard/stats', portalAuth, async (_req, res) => {
    try {
      const [total, byStatus, byProduct, recent] = await Promise.all([
        pool.query('SELECT count(*) FROM lead_intakes'),
        pool.query(`SELECT status, count(*) as cnt FROM lead_intakes GROUP BY status ORDER BY cnt DESC`),
        pool.query(`SELECT product_line, count(*) as cnt FROM lead_intakes WHERE product_line IS NOT NULL GROUP BY product_line ORDER BY cnt DESC`),
        pool.query(`SELECT count(*) FROM lead_intakes WHERE created_at > now() - interval '7 days'`),
      ]);

      res.json({
        total: +total.rows[0].count,
        last_7_days: +recent.rows[0].count,
        by_status: byStatus.rows,
        by_product: byProduct.rows,
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  /* ── INTERNAL: list opportunities (pipeline) ────────── */
  router.get('/opportunities', portalAuth, async (req, res) => {
    try {
      const { stage, owner, page = 1, limit = 50 } = req.query;
      const offset = (Math.max(1, +page) - 1) * +limit;
      let where = [];
      let params = [];
      let idx = 1;
      if (stage) { where.push(`o.stage = $${idx++}`); params.push(stage); }
      if (owner) { where.push(`o.owner = $${idx++}`); params.push(owner); }
      const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const countQ = await pool.query(`SELECT count(*) FROM opportunities o ${clause}`, params);
      const total = +countQ.rows[0].count;
      params.push(+limit, offset);
      const rows = await pool.query(
        `SELECT o.*, li.company_name, li.contact_name, li.ticket_number
         FROM opportunities o
         LEFT JOIN lead_intakes li ON li.id = o.lead_intake_id
         ${clause}
         ORDER BY o.updated_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );
      res.json({ total, page: +page, limit: +limit, data: rows.rows });
    } catch (e) {
      console.error('List opportunities error:', e.message);
      res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
  });

  /* ── INTERNAL: get single opportunity detail ──────── */
  router.get('/opportunities/:id', portalAuth, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT o.*, li.company_name, li.contact_name, li.contact_email, li.ticket_number, li.product_line AS lead_source
         FROM opportunities o
         LEFT JOIN lead_intakes li ON li.id = o.lead_intake_id
         WHERE o.id = $1`,
        [req.params.id]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Opportunity not found' });
      res.json({ opportunity: r.rows[0] });
    } catch (e) {
      console.error('Opportunity detail error:', e.message);
      res.status(500).json({ error: 'Failed to fetch opportunity' });
    }
  });

  /* ── INTERNAL: update opportunity (stage, next_action, closed_at) ── */
  router.patch('/opportunities/:id', portalAuth, async (req, res) => {
    try {
      const oppId = req.params.id;
      const b = req.body || {};
      const allowed = ['stage', 'owner', 'next_action', 'next_action_at', 'estimated_value', 'probability', 'closed_at'];
      const sets = [];
      const params = [];
      let idx = 1;
      for (const k of allowed) {
        if (b[k] !== undefined) {
          sets.push(`${k} = $${idx++}`);
          params.push(k === 'closed_at' && b[k] === true ? new Date() : b[k]);
        }
      }
      if (!sets.length) return res.status(400).json({ error: 'No valid fields to update' });

      const opp = await pool.query('SELECT id, lead_intake_id, stage FROM opportunities WHERE id = $1', [oppId]);
      if (!opp.rows.length) return res.status(404).json({ error: 'Opportunity not found' });

      const oldStage = opp.rows[0].stage;
      const newStage = b.stage !== undefined ? b.stage : oldStage;

      sets.push('updated_at = now()');
      params.push(oppId);
      await pool.query(`UPDATE opportunities SET ${sets.join(', ')} WHERE id = $${idx}`, params);

      if (newStage !== oldStage) {
        await pool.query(
          `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'status_change', $2, $3)`,
          [opp.rows[0].lead_intake_id, `Opportunity stage: ${oldStage} → ${newStage}`, b.updated_by || 'admin']
        );
        logAudit(pool, { userEmail: req.user?.email, action: 'opportunity_stage_change', entityType: 'opportunity', entityId: oppId, oldValues: { stage: oldStage }, newValues: { stage: newStage }, ipAddress: req.ip });
      }

      if (newStage === 'closed_won') {
        await pool.query(
          `UPDATE opportunities SET closed_at = COALESCE(closed_at, now()), updated_at = now() WHERE id = $1`,
          [oppId]
        );
        const leadId = opp.rows[0].lead_intake_id;
        if (leadId) {
          const pl = await pool.query(
            `SELECT pl.partner_id, p.commission_rate, o.estimated_value FROM partner_leads pl
             JOIN partners p ON p.id = pl.partner_id
             JOIN opportunities o ON o.lead_intake_id = pl.lead_intake_id AND o.id = $1
             WHERE pl.lead_intake_id = $2 AND pl.status = 'approved'`,
            [oppId, leadId]
          );
          if (pl.rows.length > 0) {
            const { partner_id, commission_rate, estimated_value } = pl.rows[0];
            const amount = (Number(estimated_value) || 0) * (Number(commission_rate) || 0) / 100;
            await pool.query(
              `INSERT INTO commissions (partner_id, opportunity_id, amount, currency, status) VALUES ($1, $2, $3, 'SAR', 'pending')`,
              [partner_id, oppId, amount]
            );

            try {
              const partnerRow = await pool.query(
                'SELECT contact_email FROM partners WHERE id = $1',
                [partner_id]
              );
              if (partnerRow.rows.length && partnerRow.rows[0].contact_email) {
                await sendEmail(pool, 'commission_created', {
                  company_name: l.company_name || 'Client',
                  amount,
                  currency: 'SAR',
                }, partnerRow.rows[0].contact_email, 'en');
              }
            } catch (_) {}
          }
        }
      }

      res.json({ ok: true });
    } catch (e) {
      console.error('PATCH opportunity error:', e.message);
      res.status(500).json({ error: 'Failed to update opportunity' });
    }
  });

  /* ── PARTNER: register ──────────────────────────────── */
  router.post('/public/partners/register', async (req, res) => {
    try {
      const b = req.body || {};
      const email = (b.email || b.contact_email || '').trim();
      if (!email) return res.status(400).json({ error: 'Email required' });
      if (!b.company_name?.trim()) return res.status(400).json({ error: 'Company name required' });
      const partnerType = (b.type || '').trim().toLowerCase();
      if (!['reseller', 'referral', 'technology'].includes(partnerType)) {
        return res.status(400).json({ error: 'Partner type required. Choose Reseller, Referral Partner, or Technology Partner.' });
      }

      const apiKey = crypto.randomBytes(32).toString('hex');
      const contactName = (b.contact_name || b.contactName || '').trim() || b.company_name?.trim() || 'N/A';
      const commissionRate = b.commission_rate != null ? Number(b.commission_rate) : 10;

      try {
        const result = await pool.query(
          `INSERT INTO partners (company_name, company_website, contact_name, contact_email, contact_phone, partner_type, api_key, commission_rate)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [
            b.company_name.trim(),
            (b.company_website || b.website || '').trim() || null,
            contactName,
            email.toLowerCase(),
            (b.contact_phone || b.phone || '').trim() || null,
            partnerType,
            apiKey,
            commissionRate,
          ]
        );

        try {
          await sendEmail(pool, 'partner_application_received', {
            entity_type: 'partners',
            entity_id: result.rows[0].id,
            company_name: b.company_name.trim(),
            contact_name: contactName,
          }, email.toLowerCase(), (b.lang || b.language || 'en') === 'ar' ? 'ar' : 'en');
          await sendInternalAlert(pool, 'internal_new_lead', {
            entity_type: 'partners',
            entity_id: result.rows[0].id,
            ticket_number: `PARTNER-${result.rows[0].id}`,
            company_name: b.company_name.trim(),
            contact_name: contactName,
            contact_email: email.toLowerCase(),
            product_line: 'Partner application',
            score: 0,
            assigned_to: 'partner-manager@doganconsult.com',
            admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin`,
          });
        } catch (_) {}

        return res.status(201).json({
          ok: true,
          partner_id: result.rows[0].id,
          message: 'Registration submitted. Pending approval.',
          message_ar: 'تم تقديم التسجيل. في انتظار الموافقة.',
        });
      } catch (schemaErr) {
        if (schemaErr.code === '42703') {
          const result = await pool.query(
            `INSERT INTO partners (company_name, contact_name, contact_email, contact_phone, api_key, commission_rate)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [
              b.company_name.trim(),
              contactName,
              email.toLowerCase(),
              (b.contact_phone || b.phone || '').trim() || null,
              apiKey,
              commissionRate,
            ]
          );

          try {
            await sendEmail(pool, 'partner_application_received', {
              entity_type: 'partners',
              entity_id: result.rows[0].id,
              company_name: b.company_name.trim(),
              contact_name: contactName,
            }, email.toLowerCase(), (b.lang || b.language || 'en') === 'ar' ? 'ar' : 'en');
          } catch (_) {}

          return res.status(201).json({
            ok: true,
            partner_id: result.rows[0].id,
            message: 'Registration submitted. Pending approval.',
            message_ar: 'تم تقديم التسجيل. في انتظار الموافقة.',
          });
        }
        throw schemaErr;
      }
    } catch (e) {
      if (e.code === '23505') {
        try {
          const lang = (req.body?.lang || req.body?.language || 'en') === 'ar' ? 'ar' : 'en';
          const existing = await pool.query(
            `SELECT id, company_name, contact_name, contact_email, api_key, status
             FROM partners WHERE LOWER(contact_email) = LOWER($1) LIMIT 1`,
            [email.trim().toLowerCase()]
          );
          if (existing.rows.length) {
            const p = existing.rows[0];
            if (p.status === 'approved' && p.api_key) {
              await sendEmail(pool, 'partner_portal_access', {
                entity_type: 'partners',
                entity_id: p.id,
                company_name: p.company_name,
                contact_name: p.contact_name,
                api_key: p.api_key,
                portal_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/partner`,
              }, p.contact_email, lang);
            } else {
              await sendEmail(pool, 'partner_application_received', {
                entity_type: 'partners',
                entity_id: p.id,
                company_name: p.company_name,
                contact_name: p.contact_name,
              }, p.contact_email, lang);
            }
            return res.json({ ok: true, already_registered: true, partner_id: p.id, status: p.status });
          }
        } catch (_) {}
        return res.status(409).json({ error: 'Partner already registered with this email' });
      }

      console.error('Partner register error:', e.message, e.code, e.detail || '');
      if (e.code === '42703') {
        return res.status(500).json({
          error: 'Server configuration error: partners table missing column. Run consolidated-migration.sql.',
        });
      }
      res.status(500).json({ error: 'Failed to register partner' });
    }
  });

  /* ── PARTNER: resend portal access email ─────────────── */
  router.post('/public/partners/resend-access', async (req, res) => {
    try {
      const email = (req.body?.email || '').trim().toLowerCase();
      if (!email) return res.status(400).json({ error: 'Email required' });
      const lang = (req.body?.lang || req.body?.language || 'en') === 'ar' ? 'ar' : 'en';

      const partner = await pool.query(
        `SELECT id, company_name, contact_name, contact_email, api_key, status
         FROM partners WHERE LOWER(contact_email) = LOWER($1) LIMIT 1`,
        [email]
      );
      if (!partner.rows.length) return res.status(404).json({ error: 'Partner not found' });

      const p = partner.rows[0];
      if (p.status === 'approved' && p.api_key) {
        await sendEmail(pool, 'partner_portal_access', {
          entity_type: 'partners',
          entity_id: p.id,
          company_name: p.company_name,
          contact_name: p.contact_name,
          api_key: p.api_key,
          portal_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/partner`,
        }, email, lang);
      } else {
        await sendEmail(pool, 'partner_application_received', {
          entity_type: 'partners',
          entity_id: p.id,
          company_name: p.company_name,
          contact_name: p.contact_name,
        }, email, lang);
      }

      res.json({ ok: true });
    } catch (e) {
      console.error('Resend partner access error:', e.message);
      res.status(500).json({ error: 'Failed to resend access email' });
    }
  });

  /* ── PARTNER: submit lead ───────────────────────────── */
  router.post('/partners/leads', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) return res.status(401).json({ error: 'API key required' });

      const partner = await pool.query(
        `SELECT id, contact_email, company_name FROM partners WHERE api_key = $1 AND status = 'approved'`,
        [apiKey]
      );
      if (!partner.rows.length) return res.status(403).json({ error: 'Invalid or unapproved partner' });

      const pId = partner.rows[0].id;
      const partnerEmail = (partner.rows[0].contact_email || '').trim().toLowerCase();
      const b = req.body || {};
      if (!b.contact_email?.trim()) return res.status(400).json({ error: 'Email required' });
      const countryCode = (b.country || 'SA').trim().toUpperCase();
      if (countryCode.length !== 2) return res.status(400).json({ error: 'Country must be a 2-letter code (e.g. SA, AE)' });

      const score = calculateLeadScore(b);

      // create lead
      const hash = dedupeHash(b.contact_email, b.company_name || '');
      const ticket = genTicket();

      const lead = await pool.query(
        `INSERT INTO lead_intakes (source, company_name, contact_name, contact_email, contact_phone,
          product_line, message, city, country, address_line, consent_pdpl, dedupe_hash, ticket_number, assigned_to, score)
         VALUES ('partner', $1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10, $11, 'sales@doganconsult.com', $12)
         RETURNING id, ticket_number`,
        [b.company_name || '', b.contact_name || '', b.contact_email.trim().toLowerCase(),
         b.contact_phone || null, b.product_line || null, b.message || null,
         b.city || null, countryCode, (b.address_line || '').trim() || null, hash, ticket, score]
      );

      await pool.query(
        `INSERT INTO partner_leads (partner_id, lead_intake_id, status) VALUES ($1, $2, 'submitted')`,
        [pId, lead.rows[0].id]
      );

      try {
        if (partnerEmail) {
          await sendEmail(pool, 'partner_submitted', {
            entity_type: 'partner_leads',
            entity_id: lead.rows[0].id,
            ticket_number: lead.rows[0].ticket_number,
            company_name: b.company_name || 'Client',
          }, partnerEmail, 'en');
        }

        await sendInternalAlert(pool, 'internal_new_lead', {
          entity_type: 'lead_intakes',
          entity_id: lead.rows[0].id,
          ticket_number: lead.rows[0].ticket_number,
          company_name: b.company_name || '—',
          contact_name: b.contact_name || '—',
          contact_email: b.contact_email.trim().toLowerCase(),
          product_line: b.product_line || null,
          score,
          assigned_to: 'sales@doganconsult.com',
          admin_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/admin/leads/${lead.rows[0].id}`,
        });
      } catch (_) {}

      res.status(201).json({ ok: true, ticket_number: lead.rows[0].ticket_number });
    } catch (e) {
      console.error('Partner lead error:', e.message);
      res.status(500).json({ error: 'Failed to submit partner lead' });
    }
  });

  /* ── PARTNER: list submitted leads ───────────────────── */
  router.get('/partners/leads', async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) return res.status(401).json({ error: 'API key required' });

      const partner = await pool.query(`SELECT id FROM partners WHERE api_key = $1`, [apiKey]);
      if (!partner.rows.length) return res.status(403).json({ error: 'Invalid API key' });

      const rows = await pool.query(
        `SELECT pl.id, pl.status as partner_status, pl.notes, pl.created_at,
                li.ticket_number, li.company_name, li.contact_name, li.contact_email, li.product_line, li.status as lead_status, li.created_at as lead_created_at,
                o.id AS opportunity_id, o.stage AS opportunity_stage, o.closed_at AS opportunity_closed_at
         FROM partner_leads pl
         JOIN lead_intakes li ON li.id = pl.lead_intake_id
         LEFT JOIN LATERAL (SELECT id, stage, closed_at FROM opportunities WHERE lead_intake_id = li.id ORDER BY updated_at DESC LIMIT 1) o ON true
         WHERE pl.partner_id = $1
         ORDER BY pl.created_at DESC`,
        [partner.rows[0].id]
      );

      res.json({ data: rows.rows.map((r) => ({
        id: r.id,
        status: r.lead_status ?? r.partner_status,
        notes: r.notes,
        created_at: r.lead_created_at ?? r.created_at,
        ticket_number: r.ticket_number,
        company_name: r.company_name,
        contact_name: r.contact_name,
        contact_email: r.contact_email,
        product_line: r.product_line,
        opportunity_id: r.opportunity_id ?? null,
        opportunity_stage: r.opportunity_stage ?? null,
        opportunity_closed_at: r.opportunity_closed_at ?? null,
      })) });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch partner leads' });
    }
  });

  /* ── ADMIN: list partners (for portal management) ─────── */
  router.get('/admin/partners', portalAuth, adminOnly, async (req, res) => {
    try {
      const rows = await pool.query(
        `SELECT id, company_name, company_website, contact_name, contact_email, contact_phone, partner_type, status, tier, commission_rate, created_at
         FROM partners ORDER BY created_at DESC`
      );
      res.json({ data: rows.rows });
    } catch (e) {
      console.error('Admin partners list:', e.message);
      res.status(500).json({ error: 'Failed to list partners' });
    }
  });

  /* ── ADMIN: get single partner detail ────────────────── */
  router.get('/admin/partners/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const p = await pool.query(
        `SELECT p.*,
                (SELECT count(*) FROM partner_leads pl WHERE pl.partner_id = p.id) AS leads_count,
                (SELECT count(*) FROM partner_leads pl WHERE pl.partner_id = p.id AND pl.status = 'approved') AS approved_count,
                COALESCE((SELECT sum(c.commission_amount) FROM commissions c WHERE c.partner_id = p.id AND c.status IN ('approved','paid')), 0) AS total_commission,
                COALESCE((SELECT sum(c.commission_amount) FROM commissions c WHERE c.partner_id = p.id AND c.status = 'approved' AND c.payout_requested = true), 0) AS pending_payout
         FROM partners p WHERE p.id = $1`,
        [req.params.id]
      );
      if (!p.rows.length) return res.status(404).json({ error: 'Partner not found' });
      // Also fetch their leads
      const leads = await pool.query(
        `SELECT pl.id, pl.status, pl.created_at, li.id AS lead_id, li.company_name, li.ticket_number
         FROM partner_leads pl
         LEFT JOIN lead_intakes li ON li.id = pl.lead_intake_id
         WHERE pl.partner_id = $1 ORDER BY pl.created_at DESC LIMIT 50`,
        [req.params.id]
      );
      res.json({ partner: p.rows[0], leads: leads.rows });
    } catch (e) {
      console.error('Admin partner detail:', e.message);
      res.status(500).json({ error: 'Failed to fetch partner' });
    }
  });

  /* ── ADMIN: update partner status (approve / reject / suspend) ─ */
  router.patch('/admin/partners/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Use approved, rejected, suspended, or pending.' });
      }
      const r = await pool.query(
        `UPDATE partners SET status = $1, updated_at = now() WHERE id = $2 RETURNING id, company_name, contact_email, status, api_key`,
        [status, req.params.id]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Partner not found' });
      const row = r.rows[0];

      if (row.status === 'approved' && row.contact_email && row.api_key) {
        try {
          await sendEmail(pool, 'partner_portal_access', {
            entity_type: 'partners',
            entity_id: row.id,
            company_name: row.company_name,
            contact_name: null,
            api_key: row.api_key,
            portal_url: `${process.env.APP_URL || 'https://www.doganconsult.com'}/partner`,
          }, row.contact_email, 'en');
        } catch (_) {}
      }

      logAudit(pool, { userEmail: req.user?.email, action: 'partner_status_change', entityType: 'partner', entityId: req.params.id, newValues: { status }, ipAddress: req.ip });

      res.json({
        ok: true,
        status: row.status,
        api_key: row.status === 'approved' ? row.api_key : undefined,
      });
    } catch (e) {
      console.error('Admin partner update:', e.message);
      res.status(500).json({ error: 'Failed to update partner' });
    }
  });

  /* ── ADMIN: approve partner lead ────────────────────── */
  router.post('/partners/leads/:id/approve', portalAuth, adminOnly, async (req, res) => {
    try {
      const plId = req.params.id;
      const r = await pool.query(
        `UPDATE partner_leads SET status = 'approved', approved_at = now(), approved_by = $1, exclusivity_start_at = COALESCE(exclusivity_start_at, now()), updated_at = now() WHERE id = $2 RETURNING id, lead_intake_id`,
        [req.body?.approved_by || 'admin', plId]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Partner lead not found' });
      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by, visibility) VALUES ($1, 'system', 'Partner lead approved.', $2, 'partner')`,
        [r.rows[0].lead_intake_id, req.body?.approved_by || 'admin']
      );

      // Notify partner
      const partnerQ = await pool.query('SELECT partner_id FROM partner_leads WHERE id = $1', [plId]);
      if (partnerQ.rows.length) {
        await notifyPartner(pool, partnerQ.rows[0].partner_id, {
          type: 'pipeline',
          title: 'Your lead has been approved!',
          body: `Lead ${ctx.rows[0]?.ticket_number || ''} for ${ctx.rows[0]?.company_name || 'a client'} was approved.`,
          link: '/partner?tab=overview',
        }).catch(e => console.error('Lead notification:', e.message));
      }

      try {
        const ctx = await pool.query(
          `SELECT li.ticket_number, li.company_name, p.contact_email
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           JOIN partners p ON p.id = pl.partner_id
           WHERE pl.id = $1`,
          [plId]
        );
        if (ctx.rows.length && ctx.rows[0].contact_email) {
          await sendEmail(pool, 'partner_approved', {
            entity_type: 'partner_leads',
            entity_id: plId,
            ticket_number: ctx.rows[0].ticket_number,
            company_name: ctx.rows[0].company_name,
          }, ctx.rows[0].contact_email, 'en');
        }
      } catch (_) {}

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to approve partner lead' });
    }
  });

  /* ── ADMIN: reject partner lead ─────────────────────── */
  router.post('/partners/leads/:id/reject', portalAuth, adminOnly, async (req, res) => {
    try {
      const plId = req.params.id;
      const reason = (req.body?.reason || req.body?.rejected_reason || '').trim();
      const r = await pool.query(
        `UPDATE partner_leads SET status = 'rejected', rejected_reason = $1, updated_at = now() WHERE id = $2 RETURNING id, lead_intake_id`,
        [reason || null, plId]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Partner lead not found' });
      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by, visibility) VALUES ($1, 'system', $2, 'admin', 'partner')`,
        [r.rows[0].lead_intake_id, `Partner lead rejected.${reason ? ' Reason: ' + reason : ''}`]
      );

      // Notify partner
      const partnerQR = await pool.query('SELECT partner_id FROM partner_leads WHERE id = $1', [plId]);
      if (partnerQR.rows.length) {
        await notifyPartner(pool, partnerQR.rows[0].partner_id, {
          type: 'pipeline',
          title: 'Lead submission update',
          body: `Your lead was not accepted.${reason ? ' Reason: ' + reason : ''}`,
          link: '/partner?tab=overview',
        }).catch(e => console.error('Lead notification:', e.message));
      }

      try {
        const ctx = await pool.query(
          `SELECT li.ticket_number, li.company_name, p.contact_email
           FROM partner_leads pl
           JOIN lead_intakes li ON li.id = pl.lead_intake_id
           JOIN partners p ON p.id = pl.partner_id
           WHERE pl.id = $1`,
          [plId]
        );
        if (ctx.rows.length && ctx.rows[0].contact_email) {
          await sendEmail(pool, 'partner_rejected', {
            entity_type: 'partner_leads',
            entity_id: plId,
            ticket_number: ctx.rows[0].ticket_number,
            company_name: ctx.rows[0].company_name,
            reason: reason || null,
          }, ctx.rows[0].contact_email, 'en');
        }
      } catch (_) {}

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to reject partner lead' });
    }
  });

  /* ── ADMIN: partner messages summary (all partners) ───── */
  router.get('/admin/partners/messages/summary', portalAuth, adminOnly, async (req, res) => {
    try {
      const rows = await pool.query(
        `SELECT p.id, p.company_name, p.contact_name,
                COALESCE(m.unread, 0) AS unread_count,
                m.last_message_at, m.last_body
         FROM partners p
         LEFT JOIN LATERAL (
           SELECT COUNT(*) FILTER (WHERE sender = 'partner' AND read = FALSE) AS unread,
                  MAX(created_at) AS last_message_at,
                  (SELECT body FROM partner_messages WHERE partner_id = p.id ORDER BY created_at DESC LIMIT 1) AS last_body
           FROM partner_messages WHERE partner_id = p.id
         ) m ON true
         WHERE p.status = 'approved'
         ORDER BY m.last_message_at DESC NULLS LAST`
      );
      res.json({ data: rows.rows });
    } catch (e) {
      console.error('Admin messages summary:', e.message);
      res.status(500).json({ error: 'Failed to fetch messages summary' });
    }
  });

  /* ── ADMIN: get messages for a specific partner ──────── */
  router.get('/admin/partners/:partnerId/messages', portalAuth, adminOnly, async (req, res) => {
    try {
      const rows = await pool.query(
        `SELECT id, sender, sender_name, body, read, created_at
         FROM partner_messages WHERE partner_id = $1
         ORDER BY created_at DESC LIMIT 100`,
        [req.params.partnerId]
      );
      // Mark partner messages as read
      await pool.query(
        `UPDATE partner_messages SET read = TRUE WHERE partner_id = $1 AND sender = 'partner' AND read = FALSE`,
        [req.params.partnerId]
      );
      const unreadQ = await pool.query(
        `SELECT COUNT(*) FROM partner_messages WHERE partner_id = $1 AND read = FALSE AND sender = 'partner'`,
        [req.params.partnerId]
      );
      res.json({ data: rows.rows, unread_count: +unreadQ.rows[0].count });
    } catch (e) {
      console.error('Admin partner messages:', e.message);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  /* ── ADMIN: reply to partner ─────────────────────────── */
  router.post('/admin/partners/:partnerId/messages', portalAuth, adminOnly, async (req, res) => {
    try {
      const { body } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: 'Message body required' });

      const senderName = req.portalUser?.name || req.portalUser?.email || 'Account Manager';

      await pool.query(
        `INSERT INTO partner_messages (partner_id, sender, sender_name, body)
         VALUES ($1, 'manager', $2, $3)`,
        [req.params.partnerId, senderName, body.trim()]
      );

      // Notify partner via notification + SSE + optional email
      await notifyPartner(pool, req.params.partnerId, {
        type: 'message',
        title: 'New message from your account manager',
        body: body.trim().substring(0, 200),
        link: '/partner?tab=messages',
      });

      res.json({ ok: true });
    } catch (e) {
      console.error('Admin reply error:', e.message);
      res.status(500).json({ error: 'Failed to send reply' });
    }
  });

  // ════════════════════════════════════════════════════════
  // ADMIN: Tenders CRUD
  // ════════════════════════════════════════════════════════
  router.post('/tenders', portalAuth, adminOnly, async (req, res) => {
    try {
      const { opportunity_id, lead_intake_id, user_id, title, rfp_number, issuing_entity, tender_type, submission_deadline, budget_estimate, currency, requirements } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO tenders (opportunity_id, lead_intake_id, user_id, title, rfp_number, issuing_entity, tender_type, submission_deadline, budget_estimate, currency, requirements)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [opportunity_id || null, lead_intake_id || null, user_id || null, title, rfp_number || null, issuing_entity || null, tender_type || 'open', submission_deadline || null, budget_estimate || null, currency || 'SAR', requirements || null]
      );

      // Notify client if user_id set
      if (user_id) {
        try {
          await pool.query(
            `INSERT INTO client_notifications (user_id, type, title, body, link) VALUES ($1, 'tender', $2, $3, '/workspace?tab=tenders')`,
            [user_id, `New tender: ${title}`, `A tender has been created for your opportunity.`]
          );
        } catch (_) {}
      }

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Create tender error:', e.message);
      res.status(500).json({ error: 'Failed to create tender' });
    }
  });

  router.patch('/tenders/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['status', 'rfp_number', 'issuing_entity', 'tender_type', 'submission_deadline', 'budget_estimate', 'technical_score', 'financial_score', 'our_solution_summary', 'submission_notes', 'result_notes', 'awarded_at'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      sets.push('updated_at = NOW()');

      const result = await pool.query(`UPDATE tenders SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      console.error('Update tender error:', e.message);
      res.status(500).json({ error: 'Failed to update tender' });
    }
  });

  // ════════════════════════════════════════════════════════
  // ADMIN: Demos/POC CRUD
  // ════════════════════════════════════════════════════════
  router.post('/demos', portalAuth, adminOnly, async (req, res) => {
    try {
      const { opportunity_id, lead_intake_id, user_id, title, demo_type, scheduled_date, duration_minutes, environment_url, agenda, evaluation_criteria, success_criteria, poc_start_date, poc_end_date } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO demos (opportunity_id, lead_intake_id, user_id, title, demo_type, scheduled_date, duration_minutes, environment_url, agenda, evaluation_criteria, success_criteria, poc_start_date, poc_end_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [opportunity_id || null, lead_intake_id || null, user_id || null, title, demo_type || 'demo', scheduled_date || null, duration_minutes || 60, environment_url || null, agenda || null, evaluation_criteria || null, success_criteria || null, poc_start_date || null, poc_end_date || null]
      );

      if (user_id) {
        try {
          await pool.query(
            `INSERT INTO client_notifications (user_id, type, title, body, link) VALUES ($1, 'demo', $2, $3, '/workspace?tab=demos')`,
            [user_id, `${demo_type === 'poc' ? 'POC' : 'Demo'} scheduled: ${title}`, scheduled_date ? `Scheduled for ${new Date(scheduled_date).toLocaleDateString()}` : 'Details available in your workspace.']
          );
        } catch (_) {}
      }

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Create demo error:', e.message);
      res.status(500).json({ error: 'Failed to create demo' });
    }
  });

  router.patch('/demos/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['status', 'scheduled_date', 'duration_minutes', 'environment_url', 'agenda', 'outcome', 'evaluation_score', 'next_steps', 'poc_start_date', 'poc_end_date'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      sets.push('updated_at = NOW()');

      const result = await pool.query(`UPDATE demos SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update demo' });
    }
  });

  // ════════════════════════════════════════════════════════
  // ADMIN: Projects (PMO) CRUD
  // ════════════════════════════════════════════════════════
  router.post('/projects', portalAuth, adminOnly, async (req, res) => {
    try {
      const { opportunity_id, engagement_id, user_id, title, project_code, start_date, end_date, budget, currency, owner } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO projects (opportunity_id, engagement_id, user_id, title, project_code, start_date, end_date, budget, currency, owner)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [opportunity_id || null, engagement_id || null, user_id || null, title, project_code || null, start_date || null, end_date || null, budget || null, currency || 'SAR', owner || null]
      );

      if (user_id) {
        try {
          await pool.query(
            `INSERT INTO client_notifications (user_id, type, title, body, link) VALUES ($1, 'project', $2, $3, '/workspace?tab=projects')`,
            [user_id, `New project: ${title}`, 'A new project has been created for you.']
          );
        } catch (_) {}
      }

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Create project error:', e.message);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  router.patch('/projects/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['status', 'phase', 'progress_pct', 'actual_start', 'actual_end', 'actual_cost', 'owner', 'risks', 'notes'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      sets.push('updated_at = NOW()');

      const result = await pool.query(`UPDATE projects SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  router.post('/projects/:id/milestones', portalAuth, adminOnly, async (req, res) => {
    try {
      const { title, description, due_date, sort_order } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const result = await pool.query(
        `INSERT INTO milestones (project_id, title, description, due_date, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [req.params.id, title, description || null, due_date || null, sort_order || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to create milestone' });
    }
  });

  router.patch('/milestones/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['title', 'description', 'due_date', 'status', 'completed_at', 'sort_order'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      const result = await pool.query(`UPDATE milestones SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update milestone' });
    }
  });

  router.post('/projects/:id/tasks', portalAuth, adminOnly, async (req, res) => {
    try {
      const { milestone_id, title, description, assigned_to, priority, due_date, sort_order } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const result = await pool.query(
        `INSERT INTO tasks (project_id, milestone_id, title, description, assigned_to, priority, due_date, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [req.params.id, milestone_id || null, title, description || null, assigned_to || null, priority || 'medium', due_date || null, sort_order || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  router.patch('/tasks/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['title', 'description', 'assigned_to', 'status', 'priority', 'due_date', 'completed_at', 'sort_order'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      const result = await pool.query(`UPDATE tasks SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // ════════════════════════════════════════════════════════
  // ADMIN: Contracts & Licenses CRUD
  // ════════════════════════════════════════════════════════
  router.post('/contracts', portalAuth, adminOnly, async (req, res) => {
    try {
      const { opportunity_id, project_id, user_id, title, contract_number, contract_type, vendor, start_date, end_date, auto_renew, renewal_notice_days, value, currency, payment_terms, sla_terms, notes } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO contracts (opportunity_id, project_id, user_id, title, contract_number, contract_type, vendor, start_date, end_date, auto_renew, renewal_notice_days, value, currency, payment_terms, sla_terms, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
        [opportunity_id || null, project_id || null, user_id || null, title, contract_number || null, contract_type || 'service', vendor || null, start_date || null, end_date || null, auto_renew || false, renewal_notice_days || 30, value || null, currency || 'SAR', payment_terms || null, sla_terms || null, notes || null]
      );

      if (user_id) {
        try {
          await pool.query(
            `INSERT INTO client_notifications (user_id, type, title, body, link) VALUES ($1, 'contract', $2, $3, '/workspace?tab=contracts')`,
            [user_id, `New contract: ${title}`, 'A new contract has been added to your workspace.']
          );
        } catch (_) {}
      }

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error('Create contract error:', e.message);
      res.status(500).json({ error: 'Failed to create contract' });
    }
  });

  router.patch('/contracts/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['status', 'end_date', 'auto_renew', 'renewal_notice_days', 'value', 'payment_terms', 'sla_terms', 'notes'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      sets.push('updated_at = NOW()');
      const result = await pool.query(`UPDATE contracts SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update contract' });
    }
  });

  router.post('/contracts/:id/licenses', portalAuth, adminOnly, async (req, res) => {
    try {
      const { user_id, product_name, license_key, license_type, quantity, start_date, expiry_date, auto_renew, cost_per_unit, currency, vendor, notes } = req.body || {};
      if (!product_name) return res.status(400).json({ error: 'Product name is required' });

      const result = await pool.query(
        `INSERT INTO licenses (contract_id, user_id, product_name, license_key, license_type, quantity, start_date, expiry_date, auto_renew, cost_per_unit, currency, vendor, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [req.params.id, user_id || null, product_name, license_key || null, license_type || null, quantity || 1, start_date || null, expiry_date || null, auto_renew || false, cost_per_unit || null, currency || 'SAR', vendor || null, notes || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to create license' });
    }
  });

  router.patch('/licenses/:id', portalAuth, adminOnly, async (req, res) => {
    try {
      const fields = ['product_name', 'license_key', 'license_type', 'quantity', 'assigned_users', 'start_date', 'expiry_date', 'auto_renew', 'cost_per_unit', 'status', 'notes'];
      const sets = [];
      const params = [req.params.id];
      let idx = 2;
      for (const f of fields) {
        if (req.body[f] !== undefined) { sets.push(`${f} = $${idx++}`); params.push(req.body[f]); }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      const result = await pool.query(`UPDATE licenses SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update license' });
    }
  });

  // ════════════════════════════════════════════════════════
  // ADMIN: Client Messages Management
  // ════════════════════════════════════════════════════════
  router.get('/admin/client-messages', portalAuth, adminOnly, async (req, res) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit) || 50);
      const offset = parseInt(req.query.offset) || 0;
      const result = await pool.query(
        `SELECT cm.*, u.full_name AS client_name, u.email AS client_email, u.company AS client_company
         FROM client_messages cm JOIN users u ON cm.user_id = u.id
         ORDER BY cm.created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      res.json({ data: result.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to load messages' });
    }
  });

  router.post('/admin/client-messages/:userId', portalAuth, adminOnly, async (req, res) => {
    try {
      const { body, opportunity_id } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: 'Message body required' });

      const senderName = req.portalUser?.name || req.portalUser?.email || 'Dogan Consult Team';

      const result = await pool.query(
        `INSERT INTO client_messages (user_id, opportunity_id, sender, sender_name, body)
         VALUES ($1, $2, 'team', $3, $4) RETURNING *`,
        [req.params.userId, opportunity_id || null, senderName, body.trim()]
      );

      try {
        await pool.query(
          `INSERT INTO client_notifications (user_id, type, title, body, link) VALUES ($1, 'message', $2, $3, '/workspace?tab=messages')`,
          [req.params.userId, `Message from ${senderName}`, body.trim().substring(0, 200)]
        );
      } catch (_) {}

      res.status(201).json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  return router;
}
