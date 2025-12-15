import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import authService from '../services/auth/authService.js';
import cartService from '../services/cart/cartService.js';
import orderService from '../services/order/orderService.js';
import {
  MapPin,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  CreditCard,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [shippingType, setShippingType] = useState('standard');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    setLoading(true);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const result = await cartService.getCartItems(currentUser.id);
      if (result.success) {
        const items = result.data || [];
        if (items.length === 0) {
          // Redirect to cart if empty
          navigate('/cart');
          return;
        }
        setCartItems(items);
      }
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!shippingInfo.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Prepare order items
      const orderItems = cartItems.map((item) => ({
        productId: item.watch_id,
        name: item.model,
        brand: item.brand,
        model: item.model,
        imageUrl: item.imageUrl || item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      // Create order
      const orderResult = await orderService.createOrder({
        userId: user.id,
        items: orderItems,
        shippingInfo: shippingInfo,
        paymentMethod: paymentMethod,
        shippingType: shippingType,
      });

      if (orderResult.success) {
        // Clear cart after successful order
        await cartService.clearCart(user.id);

        // Navigate to profile page
        navigate('/profile', {
          state: { orderSuccess: true, orderId: orderResult.data.id },
        });
      } else {
        alert(
          'Failed to create order: ' + (orderResult.message || 'Unknown error')
        );
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    if (shippingType === 'express') {
      return 50; // Express shipping is always $50
    }
    // Standard shipping: free if subtotal >= $500, otherwise $25
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 25;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back to Cart Link */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 sm:mb-6 font-medium text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to Cart
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div
              className=" rounded-lg shadow-md p-4 sm:p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main St"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10001"
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="United States"
                    />
                    {errors.country && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingType === 'standard'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingType"
                    value="standard"
                    checked={shippingType === 'standard'}
                    onChange={(e) => setShippingType(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        Standard Shipping
                      </p>
                      <p className="font-semibold text-indigo-600">
                        {calculateSubtotal() >= 500 ? 'FREE' : '$25'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      5-7 business days • Free on orders over $500
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingType === 'express'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingType"
                    value="express"
                    checked={shippingType === 'express'}
                    onChange={(e) => setShippingType(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        Express Shipping
                      </p>
                      <p className="font-semibold text-indigo-600">$50</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      2-3 business days • Expedited delivery
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-indigo-600 bg-indigo-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className=" rounded-lg shadow-md p-6 sticky top-4"
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.model}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.brand} {item.model}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>
                  Shipping (
                  {shippingType === 'express' ? 'Express' : 'Standard'})
                </span>
                <span
                  className={
                    calculateShipping() === 0
                      ? 'text-green-600 font-medium'
                      : ''
                  }
                >
                  {calculateShipping() === 0
                    ? 'FREE'
                    : formatCurrency(calculateShipping())}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
