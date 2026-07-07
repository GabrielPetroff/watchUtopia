import { supabase, handleSupabaseError } from '../api/supabaseClient.js';

const contactService = {
  /**
   * Submit a contact form message
   * @param {Object} messageData - Contact message data
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async submitContactMessage(messageData) {
    try {
      const name = messageData.name?.trim();
      const email = messageData.email?.trim();
      const subject = messageData.subject?.trim();
      const message = messageData.message?.trim();

      if (!name || !email || !subject || !message) {
        return { success: false, message: 'All fields are required' };
      }

      if (
        name.length > 100 ||
        email.length > 254 ||
        subject.length > 200 ||
        message.length > 5000
      ) {
        return { success: false, message: 'One or more fields are too long' };
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            subject,
            message,
            status: 'unread',
          },
        ])
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
        message: 'Message sent successfully',
      };
    } catch (error) {
      console.error('Submit contact message error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Get all contact messages (admin only)
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getAllContactMessages() {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get all contact messages error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Update contact message status
   * @param {string} messageId - The message's UUID
   * @param {string} status - New status (unread, read, replied)
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async updateMessageStatus(messageId, status) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, message: 'Status updated successfully' };
    } catch (error) {
      console.error('Update message status error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Delete a contact message
   * @param {string} messageId - The message's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async deleteContactMessage(messageId) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Delete contact message error:', error);
      return handleSupabaseError(error);
    }
  },
};

export default contactService;
