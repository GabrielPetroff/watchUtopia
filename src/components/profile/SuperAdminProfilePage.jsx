import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Package,
  CheckCircle,
  Mail,
  Eye,
} from 'lucide-react';

import contactService from '../../services/contact/contactService.js';
import dataService from '../../services/data/dataService.js';

export default function SuperAdminProfilePage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const brandSliderRef = useRef(null);
  const [showBrandLeftButton, setShowBrandLeftButton] = useState(false);
  const [showBrandRightButton, setShowBrandRightButton] = useState(true);

  // Product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    brand: '',
    model: '',
    price: '',
    image: '',
    tag: '',
    description: '',
    year: '',
    condition: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check for notification from navigation state
    if (location.state?.notification) {
      const { type, message } = location.state.notification;
      if (type === 'success') {
        setSuccess(message);
      } else if (type === 'error') {
        setError(message);
      }

      // Clear notification after 5 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);

      // Clear the state so notification doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }

    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchAllOrders();
    } else if (activeTab === 'messages') {
      fetchContactMessages();
    }
  }, [activeTab, user, location]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await dataService.getAllProducts();

      if (result.success) {
        setProducts(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await dataService.getAllOrders();

      if (result.success) {
        setOrders(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await contactService.getAllContactMessages();

      if (result.success) {
        setContactMessages(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError('Failed to fetch contact messages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await contactService.updateMessageStatus(
        messageId,
        'read'
      );
      if (result.success) {
        fetchContactMessages();
      }
    } catch (err) {
      setError('Failed to update message status');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const result = await contactService.deleteContactMessage(messageId);
      if (result.success) {
        setSuccess('Message deleted successfully');
        fetchContactMessages();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete message');
    }
  };

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

  const resetProductForm = () => {
    setProductForm({
      brand: '',
      model: '',
      price: '',
      image: '',
      tag: '',
      description: '',
      year: '',
      condition: '',
    });
    setImageFile(null);
    setImagePreview('');
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = productForm.image;

      // If user selected a new image file, upload it
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Validate we have an image URL (required for new products)
      if (!imageUrl) {
        throw new Error('Please provide an image (file upload or URL)');
      }

      const result = await dataService.createProduct({
        brand: productForm.brand.trim(),
        model: productForm.model.trim(),
        price: parseFloat(productForm.price),
        image: imageUrl,
        tag: productForm.tag?.trim() || null,
        description: productForm.description?.trim() || null,
        year: productForm.year ? parseInt(productForm.year) : null,
        condition: productForm.condition?.trim() || null,
      });

      if (!result.success) throw new Error(result.error);

      setSuccess('Product added successfully!');
      resetProductForm();
      fetchProducts();
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = productForm.image;

      // If user selected a new image file, upload it and delete old one
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);

        // Delete old image if it was from storage
        if (
          editingProduct.image &&
          editingProduct.image.includes('watch-images')
        ) {
          await deleteImage(editingProduct.image);
        }
      }

      // If no new image and no existing image URL, keep the original
      if (!imageUrl && editingProduct.image) {
        imageUrl = editingProduct.image;
      }

      const updateData = {
        brand: productForm.brand.trim(),
        model: productForm.model.trim(),
        price: parseFloat(productForm.price),
        image: imageUrl,
        tag: productForm.tag?.trim() || null,
        description: productForm.description?.trim() || null,
        year: productForm.year ? parseInt(productForm.year) : null,
        condition: productForm.condition?.trim() || null,
      };

      const result = await dataService.updateProduct(
        editingProduct.id,
        updateData
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update product');
      }

      setSuccess('Product updated successfully!');
      resetProductForm();
      await fetchProducts();
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update product: ' + err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get the product to find its image URL
      const product = products.find((p) => p.id === productId);

      // Delete from database
      const result = await dataService.deleteProduct(productId);
      if (!result.success) throw new Error(result.error);

      if (error) throw error;

      // Delete image from storage if it exists
      if (product?.image && product.image.includes('watch-images')) {
        await deleteImage(product.image);
      }

      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusChange = async (order, newStatus) => {
    setError('');
    setSuccess('');

    try {
      const result = await dataService.updateOrderStatus(order.id, newStatus);

      if (result.success) {
        // Update the local state immediately for instant UI feedback
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id ? { ...o, status: newStatus } : o
          )
        );
        setSuccess(`Order status updated to ${newStatus}`);
        // Fetch fresh data from server to ensure consistency
        await fetchAllOrders();
      } else {
        setError(result.error || 'Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status: ' + err.message);
    }
  };

  // Get unique brands for filter
  const brands = [...new Set(products.map((product) => product.brand))].sort();

  // Filter products by selected brand
  const filteredProducts =
    selectedBrand === 'all'
      ? products
      : products.filter((product) => product.brand === selectedBrand);

  const scrollBrand = (direction) => {
    const slider = brandSliderRef.current;
    if (slider) {
      const scrollAmount = 300;
      slider.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateBrandButtonVisibility = () => {
    const slider = brandSliderRef.current;
    if (slider) {
      setShowBrandLeftButton(slider.scrollLeft > 0);
      setShowBrandRightButton(
        slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10
      );
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F0F8FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-lg shadow-md p-6 mb-6"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>

        {/* Tabs */}
        <div
          className=" rounded-lg shadow-md mb-6"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="inline-block w-5 h-5 mr-2" />
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="inline-block w-5 h-5 mr-2" />
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'messages'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="inline-block w-5 h-5 mr-2" />
                Contact Messages
                {contactMessages.filter((m) => m.status === 'unread').length >
                  0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {
                      contactMessages.filter((m) => m.status === 'unread')
                        .length
                    }
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div
            className=" rounded-lg shadow-md p-6"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Products Management
              </h2>
              {!isAddingProduct && !editingProduct && (
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </button>
              )}
            </div>

            {/* Brand Filter Slider */}
            {!isAddingProduct && !editingProduct && products.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Filter by Brand
                </h3>
                <div className="relative group">
                  {/* Left Navigation Button */}
                  {showBrandLeftButton && (
                    <button
                      onClick={() => scrollBrand('left')}
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#161818] hover:bg-[#2a2c2c] text-white shadow-2xl rounded-full p-3 transition-all duration-200 items-center justify-center opacity-0 group-hover:opacity-100"
                      aria-label="Scroll left"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Slider Container */}
                  <div
                    ref={brandSliderRef}
                    onScroll={updateBrandButtonVisibility}
                    className="overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide flex gap-3 py-4"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {/* All Brands Button */}
                    <button
                      onClick={() => setSelectedBrand('all')}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                        selectedBrand === 'all'
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      All Brands ({products.length})
                    </button>

                    {/* Brand Buttons */}
                    {brands.map((brand) => {
                      const count = products.filter(
                        (p) => p.brand === brand
                      ).length;
                      return (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                            selectedBrand === brand
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                          }`}
                        >
                          {brand} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Navigation Button */}
                  {showBrandRightButton && (
                    <button
                      onClick={() => scrollBrand('right')}
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#161818] hover:bg-[#2a2c2c] text-white shadow-2xl rounded-full p-3 transition-all duration-200 items-center justify-center opacity-0 group-hover:opacity-100"
                      aria-label="Scroll right"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-600 mt-4">
                  Showing {filteredProducts.length} of {products.length}{' '}
                  products
                </p>
              </div>
            )}

            {/* Add/Edit Product Form */}
            {(isAddingProduct || editingProduct) && (
              <form
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                className="mb-8 p-6  rounded-lg border border-gray-200"
                style={{ backgroundColor: '#F0F8FF' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={productForm.brand}
                      onChange={handleProductFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={productForm.model}
                      onChange={handleProductFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <input
                      type="text"
                      name="tag"
                      value={productForm.tag}
                      onChange={handleProductFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={productForm.year}
                      onChange={handleProductFormChange}
                      placeholder="e.g., 2025"
                      min="1900"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={productForm.condition}
                      onChange={handleProductFormChange}
                      placeholder="e.g., NEW, UNWORN, USED"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image *
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-auto object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* File Upload Option */}
                    <div className="mb-3">
                      <label
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-100"
                        style={{ backgroundColor: '#F0F8FF' }}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Plus className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
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
                        <span
                          className="px-2  text-gray-500"
                          style={{ backgroundColor: '#F0F8FF' }}
                        >
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
                      required={!editingProduct && !imageFile}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {uploading
                      ? 'Uploading image...'
                      : loading
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products List */}
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products found. Add your first product!
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products found for the selected brand.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="" style={{ backgroundColor: '#F0F8FF' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className=" divide-y divide-gray-200"
                    style={{ backgroundColor: '#F0F8FF' }}
                  >
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:"
                        style={{ backgroundColor: '#F0F8FF' }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.tag || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              navigate(`/product/${product.id}/edit`);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Edit product"
                          >
                            <Edit2 className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete product"
                          >
                            <Trash2 className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div
            className=" rounded-lg shadow-md p-6"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Orders
            </h2>

            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.order_date).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleOrderStatusChange(order, 'processing')
                            }
                            disabled={order.status === 'processing'}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              order.status === 'processing'
                                ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            Processing
                          </button>
                          <button
                            onClick={() =>
                              handleOrderStatusChange(order, 'shipped')
                            }
                            disabled={order.status === 'shipped'}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              order.status === 'shipped'
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            Shipped
                          </button>
                          <button
                            onClick={() =>
                              handleOrderStatusChange(order, 'delivered')
                            }
                            disabled={order.status === 'delivered'}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">User ID:</span>
                          <p className="font-medium text-gray-900 break-all">
                            {order.user_id.slice(0, 16)}...
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <p className="font-medium text-gray-900">
                            ${parseFloat(order.total_amount).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Items:</span>
                          <p className="font-medium text-gray-900">
                            {Array.isArray(order.items)
                              ? order.items.length
                              : 0}{' '}
                            item(s)
                          </p>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      {(order.shipping_address ||
                        order.shipping_city ||
                        order.shipping_country) && (
                        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Shipping Information:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {order.shipping_address && (
                              <div>
                                <span className="text-gray-600">Address:</span>
                                <p className="font-medium text-gray-900">
                                  {order.shipping_address}
                                </p>
                              </div>
                            )}
                            {order.shipping_city && (
                              <div>
                                <span className="text-gray-600">City:</span>
                                <p className="font-medium text-gray-900">
                                  {order.shipping_city}
                                </p>
                              </div>
                            )}
                            {order.shipping_postal_code && (
                              <div>
                                <span className="text-gray-600">
                                  Postal Code:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {order.shipping_postal_code}
                                </p>
                              </div>
                            )}
                            {order.shipping_country && (
                              <div>
                                <span className="text-gray-600">Country:</span>
                                <p className="font-medium text-gray-900">
                                  {order.shipping_country}
                                </p>
                              </div>
                            )}
                            {order.shipping_phone && (
                              <div>
                                <span className="text-gray-600">Phone:</span>
                                <p className="font-medium text-gray-900">
                                  {order.shipping_phone}
                                </p>
                              </div>
                            )}
                            {order.payment_method && (
                              <div>
                                <span className="text-gray-600">Payment:</span>
                                <p className="font-medium text-gray-900">
                                  {order.payment_method === 'cash_on_delivery'
                                    ? 'Cash on Delivery'
                                    : order.payment_method}
                                </p>
                              </div>
                            )}
                            {order.shipping_type && (
                              <div>
                                <span className="text-gray-600">
                                  Shipping Type:
                                </span>
                                <p className="font-medium text-gray-900">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      order.shipping_type === 'express'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {order.shipping_type === 'express'
                                      ? 'Express Shipping'
                                      : 'Standard Shipping'}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {order.items &&
                        Array.isArray(order.items) &&
                        order.items.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Order Items:
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 text-sm  p-2 rounded"
                                  style={{ backgroundColor: '#F0F8FF' }}
                                >
                                  {item.imageUrl && (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {item.brand} - {item.model}
                                    </p>
                                    <p className="text-gray-500">
                                      Qty: {item.quantity} × $
                                      {parseFloat(item.price).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'messages' && (
          <div
            className=" rounded-lg shadow-md p-6"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Messages
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading messages...</p>
              </div>
            ) : contactMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No contact messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-6 ${
                      message.status === 'unread'
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {message.subject}
                          </h3>
                          {message.status === 'unread' && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{message.name}</span>
                          <span>{message.email}</span>
                          <span>
                            {new Date(message.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {message.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Reply to:{' '}
                      <a
                        href={`mailto:${message.email}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
