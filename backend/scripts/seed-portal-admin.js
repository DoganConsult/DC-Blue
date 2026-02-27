import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;

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

const ADMIN_EMAIL = process.env.PORTAL_ADMIN_EMAIL || 'admin@doganconsult.com';
const ADMIN_NAME = process.env.PORTAL_ADMIN_NAME || 'Portal Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.PORTAL_ADMIN_PASSWORD || 'changeme';

async function run() {
  try {
    const count = await pool.query('SELECT COUNT(*) AS n FROM portal_users');
    if (Number(count.rows[0]?.n || 0) > 0) {
      console.log('Portal users exist, skip seed.');
      return;
    }
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    await pool.query(
      `INSERT INTO portal_users (email, password_hash, role, name) VALUES ($1, $2, 'admin', $3)`,
      [ADMIN_EMAIL, hash, ADMIN_NAME]
    );
    console.log('Seeded first portal admin:', ADMIN_EMAIL);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
run();
