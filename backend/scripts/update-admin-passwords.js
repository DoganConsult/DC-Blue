import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { getConnectionString } from '../config/database.js';

const { Pool } = pkg;
const pool = new Pool({ connectionString: getConnectionString() });

const NEW_PASSWORD = 'As$123456789';
const PLATFORM_ADMIN_EMAIL = 'platform@doganconsult.com';
const PLATFORM_ADMIN_NAME = 'Platform Admin';

async function updateAdminPasswords() {
  try {
    // Hash the new password
    const hash = await bcrypt.hash(NEW_PASSWORD, 12);

    // Update existing admin password
    const updateResult = await pool.query(
      `UPDATE users
       SET password_hash = $1, updated_at = NOW()
       WHERE email = 'admin@doganconsult.com'
       RETURNING email`,
      [hash]
    );

    if (updateResult.rows.length > 0) {
      console.log('✅ Updated password for admin@doganconsult.com');
    }

    // Check if platform admin already exists
    const existing = await pool.query(
      `SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1`,
      [PLATFORM_ADMIN_EMAIL]
    );

    if (existing.rows.length === 0) {
      // Add new platform admin
      await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role, is_active, created_at)
         VALUES ($1, $2, $3, 'admin', true, NOW())`,
        [PLATFORM_ADMIN_EMAIL, hash, PLATFORM_ADMIN_NAME]
      );
      console.log('✅ Created new platform admin:', PLATFORM_ADMIN_EMAIL);
    } else {
      // Update existing platform admin password
      await pool.query(
        `UPDATE users
         SET password_hash = $1, role = 'admin', is_active = true, updated_at = NOW()
         WHERE lower(email) = lower($2)`,
        [hash, PLATFORM_ADMIN_EMAIL]
      );
      console.log('✅ Updated existing platform admin:', PLATFORM_ADMIN_EMAIL);
    }

    // List all admin users
    const admins = await pool.query(
      `SELECT email, full_name, role, is_active
       FROM users
       WHERE role = 'admin'
       ORDER BY created_at`
    );

    console.log('\n📋 Current admin users:');
    admins.rows.forEach(admin => {
      console.log(`  - ${admin.email} (${admin.full_name}) - Active: ${admin.is_active}`);
    });

    console.log('\n✨ All admin passwords have been updated to: As$123456789');

  } catch (error) {
    console.error('Error updating admin passwords:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateAdminPasswords();