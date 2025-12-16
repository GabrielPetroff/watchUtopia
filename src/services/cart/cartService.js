import { supabase } from '../api/supabaseClient.js';
import { getImageUrl } from '../image/imageService.js';

const cartService = {
  // Get all cart items for a user from the cart_items table and map image URLs

  async getCartItems(userId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cartItemsWithImageUrls = (data || []).map((item) => ({
        ...item,
        imageUrl: getImageUrl(item.image),
      }));

      return { success: true, data: cartItemsWithImageUrls };
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return { success: false, error: error.message };
    }
  },

  // Add item to cart - checks if item already exists and updates quantity, or inserts new item. Dispatches cartUpdated event

  async addToCart(userId, watchData) {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('watch_id', watchData.id)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
          .select();

        if (error) throw error;

        // Dispatch cart updated event
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        return { success: true, data: data[0] };
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: userId,
              watch_id: watchData.id,
              model: watchData.model,
              brand: watchData.brand,
              price: watchData.price,
              image: watchData.image,
              quantity: 1,
            },
          ])
          .select();

        if (error) throw error;

        // Dispatch cart updated event
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        return { success: true, data: data[0] };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(cartItemId);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select();

      if (error) throw error;

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear all cart items for a user
   */
  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.message };
    }
  },
};

export default cartService;
