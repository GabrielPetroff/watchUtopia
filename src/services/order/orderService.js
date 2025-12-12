import { supabase } from '../api/supabaseClient.js';
import { handleSupabaseError } from '../api/supabaseClient.js';

const orderService = {
  /**
   * Get all orders for a user
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Array, message?: string}>}
   */
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('order_date', { ascending: false });

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get user orders error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId - The order's UUID
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get order by ID error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Create a new order with items
   * @param {Object} orderData - Order information
   * @param {string} orderData.userId - User's UUID
   * @param {Array} orderData.items - Array of order items
   * @param {Object} orderData.shippingInfo - Shipping information
   * @param {string} orderData.paymentMethod - Payment method
   * @param {string} orderData.customerNotes - Optional customer notes
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async createOrder(orderData) {
    try {
      const { userId, items } = orderData;

      // Calculate total amount
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Prepare items for JSON storage
      const itemsJson = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        model: item.model,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      }));

      // Insert the order with items as JSON
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: totalAmount,
            status: 'pending',
            items: itemsJson,
          },
        ])
        .select()
        .single();

      if (orderError) {
        const handledError = handleSupabaseError(orderError);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        data: order,
        message: 'Order created successfully',
      };
    } catch (error) {
      console.error('Create order error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Update order status
   * @param {string} orderId - The order's UUID
   * @param {string} status - New status (pending, processing, shipped, delivered, cancelled, refunded)
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const updateData = { status };

      // Automatically set shipped_at when status changes to shipped
      if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      }

      // Automatically set delivered_at when status changes to delivered
      if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      // Return the first item from the array
      return {
        success: true,
        data: data?.[0] || null,
        message: 'Order status updated successfully',
      };
    } catch (error) {
      console.error('Update order status error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Update order tracking information
   * @param {string} orderId - The order's UUID
   * @param {string} trackingNumber - Tracking number
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async updateOrderTracking(orderId, trackingNumber) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', orderId)
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
        message: 'Tracking number updated successfully',
      };
    } catch (error) {
      console.error('Update order tracking error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Cancel an order
   * @param {string} orderId - The order's UUID
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async cancelOrder(orderId) {
    try {
      // Check if order can be cancelled (only pending or processing orders)
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      if (!['pending', 'processing'].includes(order.status)) {
        return {
          success: false,
          message: 'Order cannot be cancelled at this stage',
        };
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .select();

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return {
        success: true,
        data: data?.[0] || data,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      console.error('Cancel order error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Delete an order
   * @param {string} orderId - The order's UUID
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async deleteOrder(orderId) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
      console.error('Delete order error:', error);
      return handleSupabaseError(error);
    }
  },

  /**
   * Get order statistics for a user
   * @param {string} userId - The user's UUID
   * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
   */
  async getUserOrderStats(userId) {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, total_amount')
        .eq('user_id', userId);

      if (error) {
        const handledError = handleSupabaseError(error);
        if (handledError) {
          throw handledError;
        }
      }

      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        processingOrders: orders.filter((o) => o.status === 'processing')
          .length,
        shippedOrders: orders.filter((o) => o.status === 'shipped').length,
        deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
        cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
        totalSpent: orders
          .filter((o) => !['cancelled', 'refunded'].includes(o.status))
          .reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Get user order stats error:', error);
      return handleSupabaseError(error);
    }
  },
};

export default orderService;
