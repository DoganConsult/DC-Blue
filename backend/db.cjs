const { Pool } = require('pg');

function getConnectionString() {
  const url = process.env.DATABASE_URL;
  if (url && typeof url === 'string' && url.trim() !== '') return url.trim();
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'doganconsult';
  const user = process.env.DB_USER || 'doganconsult';
  const password = process.env.DB_PASSWORD;
  if (password === undefined || password === null) {
    throw new Error('Database config missing');
  }
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(String(password))}@${host}:${port}/${database}`;
}

const pool = new Pool({ connectionString: getConnectionString() });

module.exports = pool;
