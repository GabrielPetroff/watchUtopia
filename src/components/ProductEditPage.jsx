import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import authService from '../services/auth/authServive.js';
import dataService from '../services/data/dataService.js';
import { Save, X, Plus } from 'lucide-react';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    brand: '',
    model: '',
    price: '',
    image: '',
    tag: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const checkAuthAndFetchProduct = async () => {
      // Reset state when id changes to prevent showing stale data
      setLoading(true);
      setError('');
      setProduct(null);
      setImageFile(null);

      try {
        // Check if user is authenticated and is super-admin
        const user = await authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const userRole = user.app_metadata?.role || user.user_metadata?.role;
        if (userRole !== 'super-admin') {
          navigate('/');
          return;
        }

        // Fetch product from brands table only (for editing)
        const result = await dataService.getProductById(id, true);

        if (!result.success || !result.data) {
          setError(result.error || 'Product not found');
          return;
        }

        const data = result.data;
        setProduct(data);
        setProductForm({
          brand: data.brand,
          model: data.model,
          price: data.price.toString(),
          image: data.image,
          tag: data.tag || '',
          description: data.description || '',
        });
        setImagePreview(data.image);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProduct();
  }, [id, navigate]);

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload using data service
      const result = await dataService.uploadImage(
        'watch-images',
        file,
        filePath
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data.publicUrl;
    } catch (err) {
      throw new Error('Failed to upload image: ' + err.message);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex((part) => part === 'watch-images');
      if (bucketIndex === -1) return; // Not a Supabase storage URL

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      // Delete using data service
      await dataService.deleteImage('watch-images', filePath);
    } catch (err) {
      console.error('Failed to delete old image:', err);
      // Don't throw - this is not critical
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);
    setError('');

    try {
      let imageUrl = productForm.image;

      // If user selected a new image file, upload it and delete old one
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);

        // Delete old image if it was from storage
        if (product.image && product.image.includes('watch-images')) {
          await deleteImage(product.image);
        }
      }

      // If no new image and no existing image URL, keep the original
      if (!imageUrl && product.image) {
        imageUrl = product.image;
      }

      const updateData = {
        brand: productForm.brand.trim(),
        model: productForm.model.trim(),
        price: parseFloat(productForm.price),
        image: imageUrl,
        tag: productForm.tag?.trim() || null,
        description: productForm.description?.trim() || null,
      };

      const result = await dataService.updateProduct(id, updateData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update product');
      }

      // Show success notification and redirect
      navigate('/profile', {
        state: {
          notification: {
            type: 'success',
            message: 'Product updated successfully!',
          },
        },
      });
    } catch (err) {
      setError('Failed to update product: ' + err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">
                {product?.brand} - {product?.model}
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={productForm.brand}
                  onChange={handleProductFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={productForm.model}
                  onChange={handleProductFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  name="tag"
                  value={productForm.tag}
                  onChange={handleProductFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-auto object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

                {/* File Upload Option */}
                <div className="mb-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        new image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Or use URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or use image URL
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  name="image"
                  value={productForm.image}
                  onChange={handleProductFormChange}
                  placeholder="https://example.com/image.jpg or path/to/image.png"
                  className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {uploading
                  ? 'Uploading image...'
                  : saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                disabled={saving}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
