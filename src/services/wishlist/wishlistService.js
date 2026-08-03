import { apiGet, apiPost, apiDelete } from '../api/apiClient.js';

const wishlistService = {
  /**
   * Get user's wishlist items. userId is accepted for call-site
   * compatibility but ignored -- the API scopes to the authenticated
   * session's user, never a client-supplied id.
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getWishlist(_userId) {
    return apiGet('/api/wishlist');
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
  async addToWishlist(_userId, productId, productData) {
    return apiPost('/api/wishlist', { productId, productData });
  },

  /**
   * Remove item from wishlist
   * @param {string} wishlistItemId - The wishlist item's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async removeFromWishlist(wishlistItemId) {
    return apiDelete(`/api/wishlist/${wishlistItemId}`);
  },

  /**
   * Remove item from wishlist by product ID
   * @param {string} userId - The user's UUID
   * @param {string} productId - The product ID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async removeFromWishlistByProductId(_userId, productId) {
    return apiDelete(`/api/wishlist?productId=${productId}`);
  },

  /**
   * Check if item is in wishlist
   * @param {string} userId - The user's UUID
   * @param {string} productId - The product ID
   * @returns {Promise<{success: boolean, isInWishlist: boolean, data?: Object}>}
   */
  async isInWishlist(_userId, productId) {
    const result = await apiGet(`/api/wishlist/check?productId=${productId}`);
    if (!result.success) {
      return { success: false, isInWishlist: false };
    }
    return result;
  },
};

export default wishlistService;
