import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();

// Security: headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet({ contentSecurityPolicy: false })); // set CSP to true and configure when you have a policy

// Body size limit to reduce DoS risk
app.use(express.json({ limit: '256kb' }));

// CORS: allowlist in production when CORS_ORIGINS is set, else allow all for dev
const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true, credentials: true }));

// Rate limit: 200 requests per 15 minutes per IP for /api and /health
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);
app.use('/health', rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));

// Database: use DATABASE_URL or build from DB_* (password must be set in .env for SCRAM auth)
function getConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const user = process.env.DB_USER || 'doganconsult';
  const password = process.env.DB_PASSWORD || '';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const name = process.env.DB_NAME || 'doganconsult';
  const enc = encodeURIComponent;
  return `postgresql://${enc(user)}:${enc(password)}@${host}:${port}/${name}`;
}
const pool = new Pool({ connectionString: getConnectionString() });

import { startScheduler } from './services/scheduler.js';

// Health for deploy / latency badge
app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Landing content (EN/AR) — works with or without DB
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
    { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: '#0EA5E9' },
    { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: '#006C35' },
    { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: '#6366F1' },
    { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: '#10B981' },
  ],
  chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] },
};

app.get('/api/public/landing', async (req, res) => {
  try {
    const content = defaultLanding;
    res.json(content);
  } catch (e) {
    res.status(500).json({ error: 'Landing content unavailable' });
  }
});

// Lead capture (legacy — kept for contact form)
app.post('/api/public/leads', (req, res) => {
  const { name, email, company, message } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  pool.query(
    'insert into leads (name, email, company, message, created_at) values ($1,$2,$3,$4,now())',
    [name || null, email, company || null, message || null]
  ).then(() => res.status(201).json({ ok: true })).catch(() => res.status(500).json({ error: 'Failed to save' }));
});

// PLRP + DLI routes (inquiry intake, lead management, partner portal)
import leadsRouter, { portalAuth, adminOnly } from './routes/leads.js';
import engagementsRouter from './routes/engagements.js';
import gatesRouter from './routes/gates.js';
import filesRouter from './routes/files.js';
import matrixApiRouter from './routes/matrix-api.js';
import commissionsRouter from './routes/commissions.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';

app.use('/api/v1', leadsRouter(pool));
app.use('/api/v1/public', authRouter(pool));
app.use('/api/v1', engagementsRouter(pool, portalAuth));
app.use('/api/v1', gatesRouter(pool, portalAuth));
app.use('/api/v1', filesRouter(pool, portalAuth));
app.use('/api/v1', matrixApiRouter());
app.use('/api/v1', commissionsRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', aiRouter(pool));

startScheduler(pool);

// Serve Angular static (after API routes) for production deploy
const path = await import('path');
const { fileURLToPath } = await import('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, '../frontend/dist/dogan-consult-web/browser');
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return res.status(404).end();
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Dogan Consult API on :${PORT}`));
