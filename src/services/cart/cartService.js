import { apiGet, apiPost, apiPatch, apiDelete } from '../api/apiClient.js';

const cartService = {
  // Get all cart items for a user. userId is accepted for call-site
  // compatibility but ignored -- the API scopes to the authenticated
  // session's user, never a client-supplied id.

  async getCartItems(_userId) {
    return apiGet('/api/cart');
  },

  // Add item to cart - server checks if item already exists and updates
  // quantity, or inserts new item. Dispatches cartUpdated event

  async addToCart(_userId, watchData) {
    const result = await apiPost('/api/cart', watchData);
    if (result.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    return result;
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId, quantity) {
    const result = await apiPatch(`/api/cart/${cartItemId}`, { quantity });
    if (result.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    return result;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId) {
    const result = await apiDelete(`/api/cart/${cartItemId}`);
    if (result.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    return result;
  },

  /**
   * Clear all cart items for the current user
   */
  async clearCart(_userId) {
    const result = await apiDelete('/api/cart');
    if (result.success) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    return result;
  },
};

export default cartService;
