import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { getConnectionString } from '../config/database.js';

const { Pool } = pkg;

const pool = new Pool({ connectionString: getConnectionString() });

const ADMIN_EMAIL = process.env.PORTAL_ADMIN_EMAIL || 'admin@doganconsult.com';
const ADMIN_NAME = process.env.PORTAL_ADMIN_NAME || 'Portal Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.PORTAL_ADMIN_PASSWORD || 'As$123456789';

/** Seed first portal admin into users table so login via /api/v1/public/auth/login works. */
async function run() {
  try {
    const count = await pool.query(
      `SELECT COUNT(*) AS n FROM users WHERE lower(role) = 'admin' LIMIT 1`
    );
    if (Number(count.rows[0]?.n || 0) > 0) {
      console.log('Admin user already exists in users table, skip seed.');
      return;
    }
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, 'admin', true)`,
      [ADMIN_EMAIL, hash, ADMIN_NAME]
    );
    console.log('Seeded first portal admin in users table:', ADMIN_EMAIL);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
run();
