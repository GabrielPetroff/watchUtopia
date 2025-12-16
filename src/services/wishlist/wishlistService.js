import { supabase } from '../api/supabaseClient.js';
import { handleSupabaseError } from '../api/supabaseClient.js';

const wishlistService = {
  /**
   * Get user's wishlist items
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getWishlist(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get wishlist error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Add item to wishlist
   * @param {string} userId - The user's UUID
   * @param {string} productId - The product/watch ID
   * @param {Object} productData - Product information
   * @param {string} productData.name - Product name (model)
   * @param {number} productData.price - Product price
   * @param {string} productData.image_url - Product image URL
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async addToWishlist(userId, productId, productData) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert([
          {
            user_id: userId,
            product_id: productId,
            product_name: productData.name || productData.model,
            product_price: productData.price,
            product_image_url: productData.image_url,
          },
        ])
        .select()
        .single();

      if (error) {
        // Handle duplicate entry gracefully
        if (error.code === '23505') {
          return {
            success: false,
            message: 'Item is already in your wishlist',
          };
        }
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data, message: 'Added to wishlist successfully' };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Remove item from wishlist
   * @param {string} wishlistItemId - The wishlist item's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async removeFromWishlist(wishlistItemId) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, message: 'Removed from wishlist successfully' };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Remove item from wishlist by product ID
   * @param {string} userId - The user's UUID
   * @param {string} productId - The product ID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async removeFromWishlistByProductId(userId, productId) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, message: 'Removed from wishlist successfully' };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Check if item is in wishlist
   * @param {string} userId - The user's UUID
   * @param {string} productId - The product ID
   * @returns {Promise<{success: boolean, isInWishlist: boolean, data?: Object}>}
   */
  async isInWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is expected
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, isInWishlist: !!data, data };
    } catch (error) {
      console.error('Check wishlist error:', error);
      return { success: false, isInWishlist: false };
    }
  },
};

export default wishlistService;
