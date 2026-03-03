import 'dotenv/config';
import { checkEnvironment } from './config/env-check.js';
checkEnvironment();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pkg from 'pg';
import { getConnectionString } from './config/database.js';
import { runMigrations, verifyCriticalTables } from './services/migrations.js';
const { Pool } = pkg;

const app = express();

app.use(compression());

app.use(helmet({ contentSecurityPolicy: false }));

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

// Database: single canonical resolver
const pool = new Pool({ connectionString: getConnectionString() });

// Run migrations on startup
(async () => {
  try {
    console.log('[startup] Running database migrations...');
    const migrationResults = await runMigrations(pool);
    
    // Verify critical tables
    const tableStatus = await verifyCriticalTables(pool);
    const missingTables = Object.entries(tableStatus)
      .filter(([_, exists]) => !exists)
      .map(([name]) => name);
    
    if (missingTables.length > 0) {
      console.warn('[startup] WARNING: Missing critical tables:', missingTables.join(', '));
    } else {
      console.log('[startup] ✓ All critical tables verified');
    }
  } catch (err) {
    console.error('[startup] Migration check failed:', err.message);
  }
})();

import { startScheduler } from './services/scheduler.js';

// Health for deploy / latency badge
app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Landing content (EN/AR) — served by public-content router from DB with fallback
// Lead capture (legacy — kept for contact form; will unify to lead_intakes in api-unify-leads)
// Lead capture — unified: write to lead_intakes (source=website_contact) so one table backs contact + inquiry
app.post('/api/public/leads', async (req, res) => {
  const { name, email, company, message } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  const crypto = await import('crypto');
  const hash = crypto.createHash('sha256').update(`${String(email).toLowerCase().trim()}|${String(company || '').toLowerCase().trim()}`).digest('hex').slice(0, 64);
  const d = new Date();
  const ticket = `DC${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  pool.query(
    `INSERT INTO lead_intakes (source, company_name, contact_name, contact_email, message, dedupe_hash, ticket_number, assigned_to, score, consent_pdpl)
     VALUES ('website_contact',$1,$2,$3,$4,$5,$6,'sales@doganconsult.com',$7,true)`,
    [String(company || '—').trim(), String(name || '—').trim(), String(email).trim().toLowerCase(), (message && String(message).trim()) || null, hash, ticket, calculateLeadScore({ contact_email: email, company_name: company, contact_name: name, message })]
  ).then(() => res.status(201).json({ ok: true })).catch((e) => { console.error('Lead insert:', e.message); res.status(500).json({ error: 'Failed to save' }); });
});

app.use('/api/public', publicContentRouter(pool));

// PLRP + DLI routes (inquiry intake, lead management, partner portal)
import { calculateLeadScore } from './services/scoring.js';
import publicContentRouter from './routes/public-content.js';
import leadsRouter, { portalAuth, adminOnly, optionalAuth } from './routes/leads.js';
import engagementsRouter from './routes/engagements.js';
import gatesRouter from './routes/gates.js';
import filesRouter from './routes/files.js';
import matrixApiRouter from './routes/matrix-api.js';
import commissionsRouter from './routes/commissions.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import sbgRouter from './routes/sbg.js';
import emailTestRouter from './routes/email-test.js';
import adminMailRouter from './routes/admin-mail.js';
import partnerPortalRouter from './routes/partner-portal.js';
import adminNotificationsRouter from './routes/admin-notifications.js';
import adminAnalyticsRouter from './routes/admin-analytics.js';
import adminAuditRouter from './routes/admin-audit.js';
import adminExportRouter from './routes/admin-export.js';
import adminContentRouter from './routes/admin-content.js';
import customerRouter from './routes/customer.js';
import clientWorkspaceRouter from './routes/client.js';
import erpBridgeRouter from './routes/erp-bridge.js';
import adminSettingsRouter from './routes/admin-settings.js';
import partnerTrainingRouter from './routes/partner-training.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const themeRouter = require('./routes/theme.cjs');
const copilotRouter = require('./routes/copilot.cjs');

app.use('/api/v1', leadsRouter(pool));
app.use('/api/v1/public', authRouter(pool));
app.use('/api/v1', authRouter(pool));  // Also mount at /api/v1/auth/* for admin dashboard
app.use('/api/v1/email', emailTestRouter(pool));
app.use('/api/v1', adminMailRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', themeRouter);
app.use('/api/v1/ai', copilotRouter);
app.use('/api/v1', engagementsRouter(pool, portalAuth));
app.use('/api/v1', gatesRouter(pool, portalAuth));
app.use('/api/v1', filesRouter(pool, portalAuth));
app.use('/api/v1', matrixApiRouter());
app.use('/api/v1', commissionsRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', partnerPortalRouter(pool));
app.use('/api/v1', adminNotificationsRouter(pool, portalAuth));
app.use('/api/v1', adminAnalyticsRouter(pool, portalAuth));
app.use('/api/v1', adminAuditRouter(pool, portalAuth));
app.use('/api/v1', adminExportRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', adminContentRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', customerRouter(pool, portalAuth));
app.use('/api/v1', clientWorkspaceRouter(pool, portalAuth));
app.use('/api/v1', erpBridgeRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', adminSettingsRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', partnerTrainingRouter(pool, portalAuth, adminOnly));
app.use('/api/v1', aiRouter(pool));
app.use('/api/sbg', sbgRouter(pool));

startScheduler(pool);

// Serve Angular static (after API routes) for production deploy
// Prefer backend/public when present (e.g. after scripts/deploy.sh copy); else use frontend dist
const path = await import('path');
const fs = await import('fs');
const { fileURLToPath } = await import('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, '../frontend/dist/dogan-consult-web/browser');
const staticDir = fs.existsSync(publicDir) ? publicDir : distDir;
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return res.status(404).end();
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Dogan Consult API on :${PORT}`));
