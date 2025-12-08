import { supabase } from '../api/supabaseClient.js';
import { handleSupabaseError } from '../api/supabaseClient.js';

const authService = {
  // Register an user

  async register(email, password, additionalData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData,
        },
      });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);

      return handleSupabaseError(error);
    }
  },

  // Login user

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Login error: ', error);
      return handleSupabaseError(error);
    }
  },

  // Logout User

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return handleSupabaseError(error);
    }
  },

  // Get logged user

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          return null;
        }
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Listen for state change in login/logout

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Get current session

  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          return null;
        }
      }

      return session;
    } catch (error) {
      console.error('Get session error: ', error);
      return null;
    }
  },

  // Check if user is authenticated

  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  },

  // Send reset password email

  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Password reset error:', error);
      return handleSupabaseError(error);
    }
  },

  // Update password

  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Update password error: ', error);
      return handleSupabaseError(error);
    }
  },

  // Refresh current session

  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, session: data.session };
    } catch (error) {
      console.error('Refresh session error: ', error);
      return handleSupabaseError(error);
    }
  },
};

export default authService;
