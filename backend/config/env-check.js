/**
 * Startup environment variable validation.
 * Warns about missing optional vars; errors on missing required vars.
 */

export function checkEnvironment() {
  const warnings = [];

  // Required (app will fail without these)
  if (!process.env.JWT_SECRET) {
    console.error('[env] FATAL: JWT_SECRET is not set. Authentication will fail.');
    process.exit(1);
  }

  // Email (optional but important)
  const hasGraph = !!(process.env.MSGRAPH_TENANT_ID && process.env.MSGRAPH_CLIENT_ID && process.env.MSGRAPH_CLIENT_SECRET);
  if (!hasGraph) {
    warnings.push('MSGRAPH_TENANT_ID / MSGRAPH_CLIENT_ID / MSGRAPH_CLIENT_SECRET not set — emails will run in dry-run mode (logged but not sent)');
  }

  // AI (optional)
  if (!process.env.ANTHROPIC_API_KEY) {
    warnings.push('ANTHROPIC_API_KEY not set — AI features (copilot, lead summary, proposals) will be unavailable');
  }

  // ERP (optional)
  if (!process.env.ERP_URL && !process.env.ERP_API_KEY) {
    warnings.push('ERP_URL / ERP_API_KEY not set — ERP sync will use database config or defaults');
  }

  // CORS
  if (!process.env.CORS_ORIGINS) {
    warnings.push('CORS_ORIGINS not set — CORS allows all origins (fine for dev, restrict in production)');
  }

  // Print warnings
  if (warnings.length) {
    console.log('[env] Environment check:');
    for (const w of warnings) {
      console.warn(`  ⚠ ${w}`);
    }
  } else {
    console.log('[env] ✓ All environment variables configured');
  }
}
