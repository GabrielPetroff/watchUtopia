import { authClient } from './authClient.js';

// Thin adapter over the Better Auth React client, kept as a plain module
// (not hooks) because RegisterPage.jsx imports and calls authService
// directly rather than going through AuthContext/useAuth(). Preserves the
// same method names/return shapes the app was built against under
// Supabase, so callers didn't need to change.

const authService = {
  // Register a new user with email, password and optional additional data.
  // additionalData currently only carries { display_name } from
  // RegisterPage.jsx -> mapped onto Better Auth's required `name` field.
  async register(email, password, additionalData = {}) {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: additionalData.display_name || additionalData.fullName || email,
      });

      if (error) {
        return { success: false, message: error.message, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message, error };
    }
  },

  // Login user with email and password credentials, returns user and session data
  async login(email, password) {
    try {
      const { data, error } = await authClient.signIn.email({ email, password });

      if (error) {
        return { success: false, message: error.message, error };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Login error: ', error);
      return { success: false, message: error.message, error };
    }
  },

  // Logout current user and clear their session
  async logout() {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        return { success: false, message: error.message, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message, error };
    }
  },

  // Get currently logged in user from the active Better Auth session
  async getCurrentUser() {
    try {
      const { data } = await authClient.getSession();
      return data?.user ?? null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Listen for authentication state changes (login/logout).
  // Not currently called anywhere in the app (component code should
  // prefer Better Auth's reactive `authClient.useSession()` hook instead);
  // kept as a no-op-returning stub for interface parity with the old
  // Supabase-backed authService.
  onAuthStateChange(callback) {
    console.warn(
      'authService.onAuthStateChange is unused under Better Auth; use authClient.useSession() in components instead.'
    );
    if (typeof callback === 'function') {
      // No subscription established -- caller still gets a matching
      // { data: { subscription: { unsubscribe } } } shape to destructure.
    }
    return { data: { subscription: { unsubscribe() {} } } };
  },

  // Get current authentication session
  async getSession() {
    try {
      const { data } = await authClient.getSession();
      return data?.session ?? null;
    } catch (error) {
      console.error('Get session error: ', error);
      return null;
    }
  },

  // Check if user is currently authenticated by verifying active session exists
  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  },
};

export default authService;
