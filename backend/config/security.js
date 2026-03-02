/**
 * Security config for auth (password policy, lockout).
 * Reads from process.env so it works in both dev and production.
 */

const defaults = {
  passwordMinLength: 12,
  maxLoginAttempts: 5,
  lockoutDurationMs: 900000, // 15 minutes
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: true
};

export function getSecurityConfig() {
  return {
    passwordMinLength: Math.max(8, parseInt(process.env.PASSWORD_MIN_LENGTH || String(defaults.passwordMinLength), 10) || defaults.passwordMinLength),
    maxLoginAttempts: Math.max(1, parseInt(process.env.MAX_LOGIN_ATTEMPTS || String(defaults.maxLoginAttempts), 10) || defaults.maxLoginAttempts),
    lockoutDurationMs: Math.max(60000, parseInt(process.env.LOCKOUT_DURATION_MS || String(defaults.lockoutDurationMs), 10) || defaults.lockoutDurationMs),
    passwordRequireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    passwordRequireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    passwordRequireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
    passwordRequireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false'
  };
}

export function validatePasswordPolicy(password, config = getSecurityConfig()) {
  if (password.length < config.passwordMinLength) {
    return { valid: false, error: `Password must be at least ${config.passwordMinLength} characters` };
  }
  if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (config.passwordRequireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (config.passwordRequireNumber && !/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (config.passwordRequireSpecial && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  return { valid: true };
}
