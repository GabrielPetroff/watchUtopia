import { supabase } from '../api/supabaseClient.js';
import { getImageUrl } from '../image/imageService.js';

// Centralized data service for all database operations

const dataService = {
  // ==================== WATCH/PRODUCT OPERATIONS ====================

  /**
   * Fetch all products from the brands table
   */
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;

      const productsWithImageUrls = (data || []).map((product) => ({
        ...product,
        imageUrl: getImageUrl(product.image),
      }));

      return { success: true, data: productsWithImageUrls };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch a single product by ID
   * By default, fetches from brands table only
   * @param {string} id - Product ID
   * @param {boolean} brandsOnly - If true, only fetch from brands table (default behavior)
   * @param {boolean} checkFeatured - If true, check featured watches table first, then brands table
   */
  async getProductById(id, brandsOnly = false, checkFeatured = false) {
    try {
      let data, error;

      if (checkFeatured) {
        // Check featured watches first, then fall back to brands
        const featuredResult = await supabase
          .from('feauteredwatches')
          .select('*')
          .eq('id', id)
          .single();

        // If not found in featured, try brands table
        if (!featuredResult.data || featuredResult.error) {
          const result = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();
          data = result.data;
          error = result.error;
        } else {
          data = featuredResult.data;
          error = featuredResult.error;
        }
      } else {
        // Default: only fetch from brands table
        const result = await supabase
          .from('brands')
          .select('*')
          .eq('id', id)
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      if (data) {
        return {
          success: true,
          data: {
            ...data,
            imageUrl: getImageUrl(data.image),
          },
        };
      }

      return { success: false, error: 'Product not found' };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([productData])
        .select();

      if (error) throw error;

      return {
        success: true,
        data: data[0],
        message: 'Product created successfully',
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update a product
   */
  async updateProduct(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: data[0],
        message: 'Product updated successfully',
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Increment times_bought for a product
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to increment by (default: 1)
   */
  async incrementTimesBought(productId, quantity = 1) {
    try {
      // Use RPC function to bypass RLS
      const { data, error } = await supabase.rpc('increment_times_bought', {
        product_id: productId,
        quantity_to_add: quantity,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data,
        message: 'Times bought updated successfully',
      };
    } catch (error) {
      console.error('Error updating times bought:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    try {
      const { error } = await supabase.from('brands').delete().eq('id', id);

      if (error) throw error;

      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== FEATURED WATCHES OPERATIONS ====================

  /**
   * Fetch best selling watches based on times_bought from brands table
   */
  async getBestSellers(limit = 12) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, brand, model, price, image, times_bought')
        .not('times_bought', 'is', null)
        .gt('times_bought', 0)
        .order('times_bought', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const watchesWithImageUrls = (data || []).map((watch) => ({
        ...watch,
        imageUrl: getImageUrl(watch.image),
      }));

      return { success: true, data: watchesWithImageUrls };
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch latest watch releases from brands table
   */
  async getLatestReleases(limit = 12) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const watchesWithImageUrls = (data || []).map((watch) => ({
        ...watch,
        imageUrl: getImageUrl(watch.image),
      }));

      return { success: true, data: watchesWithImageUrls };
    } catch (error) {
      console.error('Error fetching latest releases:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== ORDER OPERATIONS ====================

  /**
   * Fetch all orders (admin only)
   */
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;

      console.log('getAllOrders fetched:', data?.length, 'orders');
      console.log(
        'Order IDs:',
        data?.map((o) => o.id.slice(0, 8))
      );

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch orders for a specific user
   */
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('order_date', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user order statistics
   */
  async getUserOrderStats(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const orders = data || [];
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        processingOrders: orders.filter((o) => o.status === 'processing')
          .length,
        shippedOrders: orders.filter((o) => o.status === 'shipped').length,
        deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
        completedOrders: orders.filter((o) => o.status === 'delivered').length,
        totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0),
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching user order stats:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update order status (admin only)
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
        throw error;
      }

      return {
        success: true,
        data: data?.[0] || null,
        message: 'Order status updated successfully',
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== STORAGE/IMAGE OPERATIONS ====================

  /**
   * Upload image to storage bucket
   */
  async uploadImage(bucketName, file, filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      return { success: true, data: { path: data.path, publicUrl } };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete image from storage bucket
   */
  async deleteImage(bucketName, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get public URL for an image
   */
  getImagePublicUrl(bucketName, filePath) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrl;
  },

  /**
   * List all files in a storage bucket
   */
  async listStorageFiles(bucketName, path = '', options = {}) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(path, {
          limit: options.limit || 100,
          offset: options.offset || 0,
          sortBy: options.sortBy || { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error listing storage files:', error);
      return { success: false, error: error.message };
    }
  },

  // ==================== BRAND OPERATIONS ====================

  /**
   * Fetch brand logos from storage bucket
   */
  async getBrandLogos() {
    try {
      const { data, error } = await supabase.storage.from('brands').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error) throw error;

      const imageFiles = (data || []).filter(
        (file) =>
          file.name &&
          !file.name.startsWith('.') &&
          file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
      );

      const brands = imageFiles.map((file) => {
        const publicUrl = supabase.storage
          .from('brands')
          .getPublicUrl(file.name).data.publicUrl;

        // Extract brand name from filename (remove extension and format)
        const brandName = file.name
          .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          image: publicUrl,
          brand: brandName,
          filename: file.name,
        };
      });

      return { success: true, data: brands };
    } catch (error) {
      console.error('Error fetching brand logos:', error);
      return { success: false, error: error.message };
    }
  },
};

export default dataService;
