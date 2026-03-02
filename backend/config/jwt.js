/**
 * Single canonical JWT secret for the platform.
 * No fallbacks: startup fails if JWT_SECRET is missing (prevents weak/default secrets in production).
 */

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    throw new Error(
      'JWT_SECRET is required. Set it in .env or environment (no default is allowed).'
    );
  }
  return secret.trim();
}
