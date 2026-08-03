import { supabase } from '../api/supabaseClient.js';
import { getImageUrl } from '../image/imageService.js';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/apiClient.js';

// Centralized data service for all database operations.
// DB methods below call the Netlify Functions API (Neon/Prisma). Storage
// methods still call Supabase Storage directly -- that part of the stack
// was intentionally left in place, only the DB + Auth moved to Neon.
const dataService = {
  // ==================== WATCH/PRODUCT OPERATIONS ====================

  // Fetch all products from the brands table ordered by brand name and map image URLs

  async getAllProducts() {
    const result = await apiGet('/api/products');
    if (!result.success) return result;

    return {
      success: true,
      data: (result.data || []).map((product) => ({
        ...product,
        imageUrl: getImageUrl(product.image),
      })),
    };
  },

  // Fetch a single product by ID from brands table and map its image URL

  async getProductById(id) {
    const result = await apiGet(`/api/products/${id}`);
    if (!result.success) return result;

    return {
      success: true,
      data: { ...result.data, imageUrl: getImageUrl(result.data.image) },
    };
  },

  // Create a new product in the brands table with provided product data

  async createProduct(productData) {
    return apiPost('/api/products', productData);
  },

  // Update an existing product in the brands table by ID with new data

  async updateProduct(id, updateData) {
    return apiPatch(`/api/products/${id}`, updateData);
  },

  // Delete a product from the brands table by ID

  async deleteProduct(id) {
    return apiDelete(`/api/products/${id}`);
  },

  // ==================== FEATURED WATCHES OPERATIONS ====================

  // Fetch best selling watches based on times_bought counter from brands table, ordered by popularity
  async getBestSellers(limit = 12) {
    const result = await apiGet(`/api/products?bestsellers=1&limit=${limit}`);
    if (!result.success) return result;

    return {
      success: true,
      data: (result.data || []).map((watch) => ({
        ...watch,
        imageUrl: getImageUrl(watch.image),
      })),
    };
  },

  // Fetch latest watch releases from brands table ordered by ID (newest first)

  async getLatestReleases(limit = 12) {
    const result = await apiGet(`/api/products?latest=1&limit=${limit}`);
    if (!result.success) return result;

    return {
      success: true,
      data: (result.data || []).map((watch) => ({
        ...watch,
        imageUrl: getImageUrl(watch.image),
      })),
    };
  },

  // ==================== ORDER OPERATIONS ====================

  // Fetch all orders from database ordered by order date (admin only functionality)

  async getAllOrders() {
    return apiGet('/api/orders?all=1');
  },

  // Fetch orders for the current authenticated user. `userId` is accepted
  // for call-site compatibility but ignored -- the API derives the user
  // from the verified session, never a client-supplied id.

  async getUserOrders(_userId) {
    return apiGet('/api/orders');
  },

  // Get order statistics for the current authenticated user.

  async getUserOrderStats(_userId) {
    return apiGet('/api/orders/stats');
  },

  // Update order status (admin only) and automatically set shipped_at or delivered_at timestamps

  async updateOrderStatus(orderId, status) {
    return apiPatch(`/api/orders/${orderId}/status`, { status });
  },

  // ==================== STORAGE/IMAGE OPERATIONS (unchanged, Supabase Storage) ====================

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
