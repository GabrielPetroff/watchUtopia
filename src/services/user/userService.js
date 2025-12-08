import { supabase } from '../api/supabaseClient.js';
import { handleSupabaseError } from '../api/supabaseClient.js';

const userService = {
  /**
   * Create a user profile in public.users table
   * This should be called after user registration
   * @param {Object} userData - User profile data
   * @param {string} userData.id - User's UUID from auth.users
   * @param {string} userData.email - User's email
   * @param {string} userData.fullName - User's full name (optional)
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async createUserProfile(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userData.id,
            email: userData.email,
            full_name: userData.fullName || null,
          },
        ])
        .select()
        .single();

      if (error) {
        // If profile already exists, that's okay
        if (error.code === '23505') {
          return {
            success: true,
            message: 'User profile already exists',
          };
        }
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        data,
        message: 'User profile created successfully',
      };
    } catch (error) {
      console.error('Create user profile error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Get user profile from public.users table
   * @param {string} userId - User's UUID
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User's UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update user profile error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Update user shipping address
   * @param {string} userId - User's UUID
   * @param {Object} address - Shipping address details
   * @param {string} address.address - Street address
   * @param {string} address.city - City
   * @param {string} address.postalCode - Postal code
   * @param {string} address.country - Country
   * @param {string} address.phone - Phone number
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateShippingAddress(userId, address) {
    try {
      const updates = {
        address: address.address,
        city: address.city,
        postal_code: address.postalCode,
        country: address.country,
        phone: address.phone,
      };

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        data,
        message: 'Shipping address updated successfully',
      };
    } catch (error) {
      console.error('Update shipping address error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Get user's shipping address
   * @param {string} userId - User's UUID
   * @returns {Promise<{success: boolean, data?: Object}>}
   */
  async getShippingAddress(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('address, city, postal_code, country, phone')
        .eq('id', userId)
        .single();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        data: data
          ? {
              address: data.address,
              city: data.city,
              postalCode: data.postal_code,
              country: data.country,
              phone: data.phone,
            }
          : null,
      };
    } catch (error) {
      console.error('Get shipping address error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Check if user profile exists
   * @param {string} userId - User's UUID
   * @returns {Promise<{success: boolean, exists: boolean}>}
   */
  async userProfileExists(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, exists: !!data };
    } catch (error) {
      console.error('Check user profile error:', error);
      return { success: false, exists: false };
    }
  },
};

export default userService;
