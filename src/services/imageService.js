import { supabase } from './api/supabaseClient';

/**
 * Helper function to get the correct image URL
 * Handles: external URLs, new storage bucket (watch-images), old storage bucket (watches)
 * @param {string} imagePath - The image path/URL from the database
 * @returns {string} The correct public URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder-watch.jpg';
  }

  // If it's already a full URL (http/https), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's from the new watch-images bucket (uploaded via admin panel)
  if (imagePath.includes('watch-images')) {
    return imagePath; // Already a full Supabase storage URL
  }

  // Handle old storage paths from 'watches' bucket
  let cleanImagePath = imagePath;
  if (cleanImagePath.startsWith('watches/')) {
    cleanImagePath = cleanImagePath.replace('watches/', '');
  } else if (cleanImagePath.startsWith('img/')) {
    cleanImagePath = cleanImagePath.replace('img/', '');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('watches').getPublicUrl(cleanImagePath);

  return publicUrl;
};
