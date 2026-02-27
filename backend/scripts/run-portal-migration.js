import 'dotenv/config';
import pkg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));

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

const sql = readFileSync(join(__dirname, 'portal-users-migration.sql'), 'utf8');
// Remove comment-only lines so we don't run -- INSERT ...
const cleaned = sql
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n');
// node-pg runs one statement at a time; split on ); then CREATE INDEX
const parts = cleaned.split(/\s*;\s*(?=CREATE INDEX)/);
const statements = parts.map(p => p.trim()).filter(Boolean);

async function run() {
  try {
    for (const st of statements) {
      await pool.query(st + (st.endsWith(';') ? '' : ';'));
    }
    console.log('Portal users migration done.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
run();
