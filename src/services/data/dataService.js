import { supabase } from '../api/supabaseClient.js';
import { getImageUrl } from '../image/imageService.js';

// Centralized data service for all database operations

const dataService = {
  // ==================== WATCH/PRODUCT OPERATIONS ====================

  // Fetch all products from the brands table ordered by brand name and map image URLs

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

  // Fetch a single product by ID from brands table and map its image URL

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

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

  // Create a new product in the brands table with provided product data

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

  // Update an existing product in the brands table by ID with new data

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

  // Increment times_bought counter for a product using database function, tracks product popularity

  async incrementTimesBought(productId, quantity = 1) {
    try {
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

  // Delete a product from the brands table by ID

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

  // Fetch best selling watches based on times_bought counter from brands table, ordered by popularity
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

  // Fetch latest watch releases from brands table ordered by ID (newest first)

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

  // Fetch all orders from database ordered by order date (admin only functionality)

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

  // Fetch all orders for a specific user ordered by order date

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

  // Get user order statistics including total orders, orders by status, and total amount spent

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

  // Update order status (admin only) and automatically set shipped_at or delivered_at timestamps

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

  // Upload image to Supabase storage bucket and return path and public URL

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

  // Delete image from Supabase storage bucket by file path

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

  // ==================== BRAND OPERATIONS ====================

  // Fetch brand logos from storage bucket, filters image files and formats brand names from filenames

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
