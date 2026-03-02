/**
 * Single canonical database connection resolver.
 * Prefer DATABASE_URL; else build from DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT.
 * Fails at startup if no usable config (no default connection).
 */

function getConnectionString() {
  const url = process.env.DATABASE_URL;
  if (url && typeof url === 'string' && url.trim() !== '') {
    return url.trim();
  }
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'doganconsult';
  const user = process.env.DB_USER || 'doganconsult';
  const password = process.env.DB_PASSWORD;
  // When using DB_* parts, password must be set (use empty string for local dev if needed)
  if (password === undefined || password === null) {
    throw new Error(
      'Database config missing: set DATABASE_URL or set DB_PASSWORD (and optionally DB_HOST, DB_USER, DB_NAME, DB_PORT).'
    );
  }
  const enc = encodeURIComponent;
  return `postgresql://${enc(user)}:${enc(String(password))}@${host}:${port}/${database}`;
}

export { getConnectionString };
