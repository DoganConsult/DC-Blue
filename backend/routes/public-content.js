/**
 * Public content API — site_settings, public_content, legal_pages.
 * Served at /api/public/* (no auth).
 */

import { Router } from 'express';

const defaultLanding = {
  hero: {
    headline: { en: 'ICT Engineering, Delivered.', ar: 'هندسة تقنية المعلومات والاتصالات، مُنفّذة.' },
    subline: { en: 'Design, build, and operate enterprise-grade ICT environments.', ar: 'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية.' },
    cta: { en: 'Request Proposal', ar: 'طلب عرض' },
  },
  stats: [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } },
  ],
  services: [
    { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: '#0078D4' },
    { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: '#006C35' },
    { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: '#6366F1' },
    { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: '#10B981' },
  ],
  chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] },
};

export default function publicContentRouter(pool) {
  const router = Router();

  /** GET /api/public/site-settings — contact, WhatsApp, socials */
  router.get('/site-settings', async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT contact_email, contact_phone, whatsapp_number, address_en, address_ar, cr_number, linkedin_url, twitter_url, locale FROM site_settings WHERE id = 1 LIMIT 1'
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Site settings not found' });
      }
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Site settings unavailable' });
    }
  });

  /** GET /api/public/content/:page — about, services, case_studies, insights (and landing payload shape) */
  router.get('/content/:page', async (req, res) => {
    const page = (req.params.page || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!page) return res.status(400).json({ error: 'Invalid page' });
    try {
      const result = await pool.query(
        'SELECT content FROM public_content WHERE page = $1 LIMIT 1',
        [page]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      res.json(result.rows[0].content);
    } catch (e) {
      res.status(500).json({ error: 'Content unavailable' });
    }
  });

  /** GET /api/public/legal/:key — privacy, terms, pdpl, cookies */
  router.get('/legal/:key', async (req, res) => {
    const key = (req.params.key || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!key) return res.status(400).json({ error: 'Invalid key' });
    try {
      const result = await pool.query(
        'SELECT key, title_en, title_ar, body_en, body_ar, updated_at FROM legal_pages WHERE key = $1 LIMIT 1',
        [key]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Legal page not found' });
      }
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Legal page unavailable' });
    }
  });

  /** GET /api/public/landing — from public_content (page=landing) with fallback to default */
  router.get('/landing', async (_req, res) => {
    try {
      const result = await pool.query(
        "SELECT content FROM public_content WHERE page = 'landing' LIMIT 1"
      );
      const content = result.rows.length > 0 ? result.rows[0].content : defaultLanding;
      res.json(content);
    } catch (e) {
      res.json(defaultLanding);
    }
  });

  return router;
}
