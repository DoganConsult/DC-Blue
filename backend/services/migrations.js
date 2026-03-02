/**
 * Database Migration Runner
 * Auto-runs pending migrations on server start.
 * Tracks executed migrations in a `_migrations` table.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '../scripts');

// Define migrations in order (filename → description)
const MIGRATIONS = [
  { file: 'init-db.sql', description: 'Initial schema: leads, landing_strings' },
  { file: 'auth-enhancements-migration.sql', description: 'Password reset tokens, MFA codes' },
  { file: 'sbg-consultations.sql', description: 'SBG consultation requests table' },
  { file: 'partner-portal-migration.sql', description: 'Partner portal: notifications, messages, feedback, resources, achievements, email prefs' },
  { file: 'partner-training-and-seeds.sql', description: 'Partner training courses, progress tracking, and resource library seed data' },
  { file: 'partner-communication-enhancement.sql', description: 'Activity visibility control, message_alerts email preference' },
  { file: 'add-user-id-to-lead-intakes.sql', description: 'Add optional user_id FK to lead_intakes for authenticated submissions' },
  { file: 'unified-workspace-migration.sql', description: 'Unified workspace: tenders, solutions, projects, contracts, licenses, demos, client messaging, gate definitions' },
  { file: 'public-content-migration.sql', description: 'Public content: site_settings, public_content, legal_pages for Autonomous Consultant Office Platform' },
  { file: 'erp-sync-columns.sql', description: 'ERPNext sync tracking columns and admin_settings table' },
];

/**
 * Ensure the migrations tracking table exists
 */
async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(256) NOT NULL UNIQUE,
      description TEXT,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

/**
 * Check if a migration has been executed
 */
async function isMigrationExecuted(pool, filename) {
  const result = await pool.query(
    'SELECT id FROM _migrations WHERE filename = $1 LIMIT 1',
    [filename]
  );
  return result.rows.length > 0;
}

/**
 * Mark a migration as executed
 */
async function recordMigration(pool, filename, description) {
  await pool.query(
    'INSERT INTO _migrations (filename, description) VALUES ($1, $2) ON CONFLICT (filename) DO NOTHING',
    [filename, description]
  );
}

/**
 * Execute a single SQL migration file
 */
async function executeMigration(pool, filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`[migrations] WARNING: Migration file not found: ${filename}`);
    return false;
  }
  
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Execute the migration
  await pool.query(sql);
  return true;
}

/**
 * Run all pending migrations
 * @param {Pool} pool - PostgreSQL pool
 * @returns {Object} Migration status
 */
export async function runMigrations(pool) {
  const results = {
    executed: [],
    skipped: [],
    failed: [],
    errors: []
  };
  
  try {
    console.log('[migrations] Checking for pending migrations...');
    
    // Ensure tracking table exists
    await ensureMigrationsTable(pool);
    
    for (const migration of MIGRATIONS) {
      const { file, description } = migration;
      
      try {
        // Check if already executed
        const executed = await isMigrationExecuted(pool, file);
        
        if (executed) {
          results.skipped.push(file);
          continue;
        }
        
        console.log(`[migrations] Running: ${file} - ${description}`);
        
        const success = await executeMigration(pool, file);
        
        if (success) {
          await recordMigration(pool, file, description);
          results.executed.push(file);
          console.log(`[migrations] ✓ Completed: ${file}`);
        } else {
          results.failed.push(file);
        }
        
      } catch (err) {
        console.error(`[migrations] ✗ Failed: ${file}`, err.message);
        results.failed.push(file);
        results.errors.push({ file, error: err.message });
      }
    }
    
    // Summary
    if (results.executed.length > 0) {
      console.log(`[migrations] Executed ${results.executed.length} migration(s)`);
    } else {
      console.log('[migrations] No pending migrations');
    }
    
    return results;
    
  } catch (err) {
    console.error('[migrations] Migration system error:', err.message);
    results.errors.push({ file: '_system', error: err.message });
    return results;
  }
}

/**
 * Check if a specific table exists
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} tableName - Table to check
 * @returns {boolean}
 */
export async function tableExists(pool, tableName) {
  const result = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    )`,
    [tableName]
  );
  return result.rows[0].exists;
}

/**
 * Verify critical tables exist (used for health checks)
 */
export async function verifyCriticalTables(pool) {
  const criticalTables = [
    'users',
    'portal_users', 
    'leads',
    'password_reset_tokens',
    'mfa_codes'
  ];
  
  const status = {};
  
  for (const table of criticalTables) {
    status[table] = await tableExists(pool, table);
  }
  
  return status;
}

export default { runMigrations, tableExists, verifyCriticalTables };
