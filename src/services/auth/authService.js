import { supabase } from '../api/supabaseClient.js';
import { handleSupabaseError } from '../api/supabaseClient.js';

const authService = {
  // Register a new user with email, password and optional additional data using Supabase auth

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

  // Login user with email and password credentials, returns user and session data

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

  // Logout current user and clear their session from Supabase

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

  // Get currently logged in user from Supabase auth session

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

  // Listen for authentication state changes (login/logout) and execute callback function

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Get current authentication session from Supabase

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

  // Check if user is currently authenticated by verifying active session exists

  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  },
};

export default authService;
