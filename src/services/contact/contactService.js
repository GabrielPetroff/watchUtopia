import { apiGet, apiPost, apiPatch, apiDelete } from '../api/apiClient.js';

const contactService = {
  /**
   * Submit a contact form message. Validation (required fields, length
   * limits, email format) is enforced server-side in
   * netlify/functions/contact.js -- this is a public, unauthenticated
   * endpoint, so it can't rely on client-side validation alone.
   * @param {Object} messageData - Contact message data
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async submitContactMessage(messageData) {
    return apiPost('/api/contact', messageData);
  },

  /**
   * Get all contact messages (admin only)
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getAllContactMessages() {
    return apiGet('/api/contact');
  },

  /**
   * Update contact message status
   * @param {string} messageId - The message's UUID
   * @param {string} status - New status (unread, read, replied)
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async updateMessageStatus(messageId, status) {
    return apiPatch(`/api/contact/${messageId}`, { status });
  },

  /**
   * Delete a contact message
   * @param {string} messageId - The message's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async deleteContactMessage(messageId) {
    return apiDelete(`/api/contact/${messageId}`);
  },
};

export default contactService;
