/**
 * Check if a user has a specific role
 * @param {Object} user - The user object from authService
 * @param {string} role - The role to check for (e.g., 'super-admin')
 * @returns {boolean} - True if user has the role, false otherwise
 */
export function checkUserRole(user, role) {
  if (!user) return false;

  // `role` is a Better Auth additionalField configured with input:false
  // (see netlify/functions/_lib/betterAuth.js), so it can only ever be set
  // server-side -- never by a client sign-up/update request. Do not swap
  // this for a client-writable field.
  return user.role === role;
}

/**
 * Check if a user is a super admin
 * @param {Object} user - The user object from authService
 * @returns {boolean} - True if user is super-admin, false otherwise
 */
export function isSuperAdmin(user) {
  return checkUserRole(user, 'super-admin');
}

/**
 * Get the user's role from metadata
 * @param {Object} user - The user object from authService
 * @returns {string|null} - The user's role or null if not found
 */
export function getUserRole(user) {
  if (!user) return null;

  return user.app_metadata?.role || null;
}
