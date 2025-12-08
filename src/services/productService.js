import { supabase } from './api/supabaseClient';

/**
 * Fetch all watches from the brands table
 * @returns {Promise<Array>} Array of watches with image URLs
 */
export const fetchAllWatches = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('brand', { ascending: true });

    if (error) throw error;

    // Map through watches and get public URLs for images
    const watchesWithImageUrls = (data || []).map((watch) => {
      // Handle missing or null image paths
      if (!watch.image) {
        return {
          ...watch,
          imageUrl: '/placeholder-watch.jpg', // fallback image
        };
      }

      // Clean the image path - remove 'watches/' or 'img/' prefix if present
      let cleanImagePath = watch.image;
      if (cleanImagePath.startsWith('watches/')) {
        cleanImagePath = cleanImagePath.replace('watches/', '');
      } else if (cleanImagePath.startsWith('img/')) {
        cleanImagePath = cleanImagePath.replace('img/', '');
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('watches').getPublicUrl(cleanImagePath);

      return {
        ...watch,
        imageUrl: publicUrl,
      };
    });

    return {
      success: true,
      data: watchesWithImageUrls,
    };
  } catch (error) {
    console.error('Error fetching watches:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch watch by ID
 * @param {string|number} id - Watch ID
 * @returns {Promise<Object>} Watch object with image URL
 */
export const fetchWatchById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Handle missing or null image paths
    if (!data.image) {
      return {
        success: true,
        data: {
          ...data,
          imageUrl: '/placeholder-watch.jpg',
        },
      };
    }

    // Clean the image path
    let cleanImagePath = data.image;
    if (cleanImagePath.startsWith('watches/')) {
      cleanImagePath = cleanImagePath.replace('watches/', '');
    } else if (cleanImagePath.startsWith('img/')) {
      cleanImagePath = cleanImagePath.replace('img/', '');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('watches').getPublicUrl(cleanImagePath);

    return {
      success: true,
      data: {
        ...data,
        imageUrl: publicUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching watch:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch watches by brand
 * @param {string} brand - Brand name
 * @returns {Promise<Array>} Array of watches with image URLs
 */
export const fetchWatchesByBrand = async (brand) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('brand', brand)
      .order('model', { ascending: true });

    if (error) throw error;

    const watchesWithImageUrls = (data || []).map((watch) => {
      if (!watch.image) {
        return {
          ...watch,
          imageUrl: '/placeholder-watch.jpg',
        };
      }

      let cleanImagePath = watch.image;
      if (cleanImagePath.startsWith('watches/')) {
        cleanImagePath = cleanImagePath.replace('watches/', '');
      } else if (cleanImagePath.startsWith('img/')) {
        cleanImagePath = cleanImagePath.replace('img/', '');
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('watches').getPublicUrl(cleanImagePath);

      return {
        ...watch,
        imageUrl: publicUrl,
      };
    });

    return {
      success: true,
      data: watchesWithImageUrls,
    };
  } catch (error) {
    console.error('Error fetching watches by brand:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get unique brands from the watches
 * @returns {Promise<Array>} Array of unique brand names
 */
export const fetchBrands = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('brand')
      .order('brand', { ascending: true });

    if (error) throw error;

    // Get unique brands
    const uniqueBrands = [...new Set(data.map((item) => item.brand))];

    return {
      success: true,
      data: uniqueBrands,
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
