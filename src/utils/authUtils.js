/**
 * Check if a user has a specific role
 * @param {Object} user - The user object from authService
 * @param {string} role - The role to check for (e.g., 'super-admin')
 * @returns {boolean} - True if user has the role, false otherwise
 */
export function checkUserRole(user, role) {
  if (!user) return false;

  // Check all possible metadata locations for the role
  return (
    user.raw_app_meta_data?.role === role ||
    user.app_metadata?.role === role ||
    user.user_metadata?.role === role
  );
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

  return (
    user.raw_app_meta_data?.role ||
    user.app_metadata?.role ||
    user.user_metadata?.role ||
    null
  );
}
