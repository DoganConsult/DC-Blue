/**
 * Startup environment variable validation.
 * Warns about missing optional vars; errors on missing required vars.
 */

export function checkEnvironment() {
  const warnings = [];
  const isProd = process.env.NODE_ENV === 'production';

  if (!process.env.JWT_SECRET) {
    console.error('[env] FATAL: JWT_SECRET is not set. Authentication will fail.');
    process.exit(1);
  }

  if (isProd && process.env.JWT_SECRET.length < 32) {
    console.error('[env] FATAL: JWT_SECRET is too short for production (min 32 chars).');
    process.exit(1);
  }

  if (!process.env.ADMIN_PASSWORD) {
    warnings.push('ADMIN_PASSWORD not set — admin endpoints will be inaccessible');
  }

  const hasGraph = !!(process.env.MSGRAPH_TENANT_ID && process.env.MSGRAPH_CLIENT_ID && process.env.MSGRAPH_CLIENT_SECRET);
  if (!hasGraph) {
    warnings.push('MSGRAPH_TENANT_ID / MSGRAPH_CLIENT_ID / MSGRAPH_CLIENT_SECRET not set — emails will run in dry-run mode (logged but not sent)');
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    warnings.push('ANTHROPIC_API_KEY not set — AI features (copilot, lead summary, proposals) will be unavailable');
  }

  if (!process.env.ERP_URL && !process.env.ERP_API_KEY) {
    warnings.push('ERP_URL / ERP_API_KEY not set — ERP sync will use database config or defaults');
  }

  if (!process.env.CORS_ORIGINS) {
    if (isProd) {
      console.error('[env] FATAL: CORS_ORIGINS must be set in production to restrict cross-origin access.');
      process.exit(1);
    }
    warnings.push('CORS_ORIGINS not set — CORS allows all origins (fine for dev, restrict in production)');
  }

  if (!process.env.FRONTEND_URL && isProd) {
    warnings.push('FRONTEND_URL not set — email links will use default doganconsult.com');
  }

  console.log(`[env] Mode: ${isProd ? 'PRODUCTION' : 'development'}`);
  if (warnings.length) {
    console.log('[env] Environment check:');
    for (const w of warnings) {
      console.warn(`  ⚠ ${w}`);
    }
  } else {
    console.log('[env] ✓ All environment variables configured');
  }
}
