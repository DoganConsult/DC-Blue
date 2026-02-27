import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { calculateLeadScore } from '../services/scoring.js';
import { sendEmail, sendInternalAlert } from '../services/email.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'dogan-consult-portal-secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

/** Portal auth: legacy X-Admin-Token (password) or Bearer JWT. Sets req.portalUser = { id?, email?, role }. */
export function portalAuth(req, res, next) {
  const legacyToken = req.headers['x-admin-token'];
  if (legacyToken && legacyToken === ADMIN_PASSWORD) {
    req.portalUser = { role: 'admin' };
    return next();
  }
  const authHeader = req.headers.authorization;
  const bearer = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!bearer) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(bearer, JWT_SECRET);
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

  /* ── PUBLIC: submit inquiry ──────────────────────────── */
  router.post('/public/inquiries', async (req, res) => {
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
        result = await pool.query(
          `INSERT INTO lead_intakes (
            source, campaign_tag, product_line, vertical,
            company_name, cr_number, company_website, city, country, address_line,
            contact_name, contact_title, contact_email, contact_phone, contact_department,
            expected_users, budget_range, timeline, message,
            company_size, expected_decision_date, conditions_notes,
            consent_pdpl, dedupe_hash, ticket_number, assigned_to, score
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
          ) RETURNING id, ticket_number, created_at`,
          [
            b.source || 'website', b.campaign_tag || null, b.product_line || null, b.vertical || null,
            b.company_name.trim(), b.cr_number || null, b.company_website || null, b.city || null, b.country || 'SA', (b.address_line || '').trim() || null,
            b.contact_name?.trim() || '—', b.contact_title || null, b.contact_email.trim().toLowerCase(),
            b.contact_phone || null, b.contact_department || null,
            b.expected_users || null, b.budget_range || null, b.timeline || null, b.message?.trim() || null,
            b.company_size || null, b.expected_decision_date || null, (b.conditions_notes || '').trim() || null,
            true, hash, ticket, assignTo, score,
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
              consent_pdpl, dedupe_hash, ticket_number, assigned_to, score
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
            ) RETURNING id, ticket_number, created_at`,
            [
              b.source || 'website', b.campaign_tag || null, b.product_line || null, b.vertical || null,
              b.company_name.trim(), b.cr_number || null, b.company_website || null, b.city || null, b.country || 'SA', (b.address_line || '').trim() || null,
              b.contact_name?.trim() || '—', b.contact_title || null, b.contact_email.trim().toLowerCase(),
              b.contact_phone || null,
              b.expected_users || null, b.budget_range || null, b.timeline || null, b.message?.trim() || null,
              b.company_size || null, b.expected_decision_date || null, (b.conditions_notes || '').trim() || null,
              true, hash, ticket, assignTo, score,
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

  /* ── ADMIN: portal login (employee or admin) ────────────────────────────── */
  router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (email && password) {
      try {
        const u = await pool.query(
          'SELECT id, email, password_hash, role, name FROM portal_users WHERE LOWER(email) = LOWER($1)',
          [email.trim()]
        );
        if (!u.rows.length) return res.status(401).json({ error: 'Invalid email or password' });
        const user = u.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          ok: true,
          token,
          user: { id: user.id, email: user.email, name: user.name || user.email, role: user.role },
        });
      } catch (e) {
        console.error('Portal login error:', e.message);
        return res.status(500).json({ error: 'Login failed' });
      }
    }
    const pwOnly = req.body?.password;
    if (pwOnly && pwOnly === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ ok: true, token, user: { role: 'admin' } });
    }
    res.status(401).json({ error: 'Invalid password' });
  });

  /* ── ADMIN: one-time first user registration (when no portal users exist) ─ */
  router.post('/admin/register', async (req, res) => {
    const { setup_token, email, password, name, role } = req.body || {};
    if (!setup_token || setup_token !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Invalid setup token' });
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'email and password required' });
    }
    const safeRole = role === 'admin' ? 'admin' : 'employee';
    try {
      const count = await pool.query('SELECT count(*) FROM portal_users');
      if (+count.rows[0].count > 0) return res.status(403).json({ error: 'Portal users already exist' });
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO portal_users (email, password_hash, role, name) VALUES ($1, $2, $3, $4)',
        [email.trim().toLowerCase(), hash, safeRole, (name || '').trim() || null]
      );
      res.json({ ok: true, message: 'User created. Use email and password to log in.' });
    } catch (e) {
      if (e.code === '23505') return res.status(400).json({ error: 'Email already registered' });
      console.error('Portal register error:', e.message);
      res.status(500).json({ error: 'Registration failed' });
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

      // log activity
      const changes = Object.keys(b).filter(k => allowed.includes(k)).map(k => `${k} → ${b[k]}`).join(', ');
      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'status_change', $2, $3)`,
        [req.params.id, changes, b.updated_by || 'admin']
      );

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update lead' });
    }
  });

  /* ── INTERNAL: add activity ─────────────────────────── */
  router.post('/leads/:id/activities', portalAuth, async (req, res) => {
    try {
      const { type = 'note', body, created_by = 'admin' } = req.body || {};
      if (!body?.trim()) return res.status(400).json({ error: 'Body required' });

      await pool.query(
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, $2, $3, $4)`,
        [req.params.id, type, body.trim(), created_by]
      );
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
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'system', 'Partner lead approved.', $2)`,
        [r.rows[0].lead_intake_id, req.body?.approved_by || 'admin']
      );

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
        `INSERT INTO lead_activities (lead_intake_id, type, body, created_by) VALUES ($1, 'system', $2, 'admin')`,
        [r.rows[0].lead_intake_id, `Partner lead rejected.${reason ? ' Reason: ' + reason : ''}`]
      );

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

  return router;
}
