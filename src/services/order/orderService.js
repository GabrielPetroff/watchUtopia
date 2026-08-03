import { apiGet, apiPost, apiPatch, apiDelete } from '../api/apiClient.js';

const orderService = {
  /**
   * Get all orders for the current authenticated user. userId is accepted
   * for call-site compatibility but ignored -- the API scopes to the
   * authenticated session's user, never a client-supplied id.
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getUserOrders(_userId) {
    return apiGet('/api/orders');
  },

  /**
   * Create a new order with items. Total amount and times_bought
   * increments are computed/applied server-side (see
   * netlify/functions/orders.js), atomically with the order insert.
   * @param {Object} orderData - Order information
   * @param {Array} orderData.items - Array of order items
   * @param {Object} orderData.shippingInfo - Shipping information
   * @param {string} orderData.paymentMethod - Payment method
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async createOrder({ items, shippingInfo, paymentMethod, shippingType }) {
    return apiPost('/api/orders', { items, shippingInfo, paymentMethod, shippingType });
  },

  /**
   * Update order status
   * @param {string} orderId - The order's UUID
   * @param {string} status - New status (pending, processing, shipped, delivered, cancelled, refunded)
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateOrderStatus(orderId, status) {
    return apiPatch(`/api/orders/${orderId}/status`, { status });
  },

  /**
   * Update order shipping information
   * @param {string} orderId - The order's UUID
   * @param {Object} shippingInfo - Updated shipping information
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateOrderShipping(orderId, shippingInfo) {
    return apiPatch(`/api/orders/${orderId}/shipping`, shippingInfo);
  },

  /**
   * Delete an order
   * @param {string} orderId - The order's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async deleteOrder(orderId) {
    return apiDelete(`/api/orders/${orderId}`);
  },

  /**
   * Get order statistics for the current authenticated user
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async getUserOrderStats(_userId) {
    return apiGet('/api/orders/stats');
  },
};

export default orderService;
