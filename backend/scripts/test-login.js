import 'dotenv/config';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnectionString } from '../config/database.js';

const { Pool } = pkg;
const pool = new Pool({ connectionString: getConnectionString() });

async function testLogin(email, password) {
  try {
    console.log(`\n🔍 Testing login for: ${email}`);
    console.log(`📝 Password: ${password}`);

    // Find user
    const result = await pool.query(
      `SELECT id, email, password_hash, full_name, company, role, is_active,
              COALESCE(access_failed_count, 0) AS access_failed_count,
              lockout_end
       FROM users
       WHERE lower(email) = lower($1) LIMIT 1`,
      [email]
    );

    if (!result.rows.length) {
      console.log('❌ User not found');
      return;
    }

    const user = result.rows[0];
    console.log(`✅ User found: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.is_active}`);

    // Check if active
    if (!user.is_active) {
      console.log('❌ Account is deactivated');
      return;
    }

    // Check lockout
    const lockoutEnd = user.lockout_end ? new Date(user.lockout_end) : null;
    if (lockoutEnd && lockoutEnd > new Date()) {
      console.log(`❌ Account is locked until ${lockoutEnd}`);
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log(`🔐 Password valid: ${isValid}`);

    if (isValid) {
      // Generate token (using a test secret)
      const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Login successful!');
      console.log(`🔑 Token generated (first 50 chars): ${token.substring(0, 50)}...`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          company: user.company,
          role: user.role
        }
      };
    } else {
      console.log('❌ Invalid password');
    }

  } catch (error) {
    console.error('❌ Error during login test:', error);
  } finally {
    await pool.end();
  }
}

// Test all admin accounts
console.log('=' .repeat(60));
console.log('🧪 Testing Admin Login Credentials');
console.log('=' .repeat(60));

await testLogin('admin@doganconsult.com', 'As$123456789');
await testLogin('platform@doganconsult.com', 'As$123456789');
await testLogin('doganlap@gmail.com', 'As$123456789');