import { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

import dataService from '../../services/data/dataService.js';
import orderService from '../../services/order/orderService';

export default function UserProfilePage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingShippingInfo, setEditingShippingInfo] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      fetchUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await dataService.getUserOrders(user.id);
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const result = await dataService.getUserOrderStats(user.id);
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !confirm(
        'Are you sure you want to delete this order? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingOrderId(orderId);
    setError('');

    try {
      const result = await orderService.deleteOrder(orderId);
      if (result.success) {
        // Refresh orders and stats after deletion
        await fetchUserOrders();
        await fetchUserStats();
      } else {
        setError(result.message || 'Failed to delete order');
      }
    } catch (err) {
      setError('Failed to delete order: ' + err.message);
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleEditAddress = (order) => {
    setEditingOrderId(order.id);
    // Shipping info is stored in separate columns
    setEditingShippingInfo({
      address: order.shipping_address || '',
      city: order.shipping_city || '',
      postalCode: order.shipping_postal_code || '',
      country: order.shipping_country || '',
      phone: order.shipping_phone || '',
    });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditingShippingInfo(null);
  };

  const handleUpdateAddress = async (orderId) => {
    if (
      !editingShippingInfo.address ||
      !editingShippingInfo.city ||
      !editingShippingInfo.postalCode ||
      !editingShippingInfo.country ||
      !editingShippingInfo.phone
    ) {
      setError('All address fields are required');
      return;
    }

    setUpdatingOrderId(orderId);
    setError('');

    try {
      const result = await orderService.updateOrderShipping(
        orderId,
        editingShippingInfo
      );
      if (result.success) {
        setEditingOrderId(null);
        setEditingShippingInfo(null);
        // Refresh orders from server
        const ordersResult = await dataService.getUserOrders(user.id);
        if (ordersResult.success) {
          setOrders(ordersResult.data);
        }
      } else {
        setError(result.message || 'Failed to update delivery address');
      }
    } catch (err) {
      setError('Failed to update delivery address: ' + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleShippingInfoChange = (field, value) => {
    setEditingShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F0F8FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div
          className="rounded-lg shadow-md p-6 mb-6"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <Package className="w-10 h-10 text-indigo-600" />
              </div>
            </div>

            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.pendingOrders +
                      stats.processingOrders +
                      stats.shippedOrders}
                  </p>
                </div>
                <RefreshCw className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div
              className=" rounded-lg shadow-md p-6"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div
          className=" rounded-lg shadow-md p-6"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            <button
              onClick={fetchUserOrders}
              className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here!
              </p>
              <a
                href="/products"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Ordered on{' '}
                        {new Date(order.order_date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Array.isArray(order.items) ? order.items.length : 0}{' '}
                        item(s)
                      </p>
                      {order.status === 'pending' && (
                        <div className="mt-3 flex gap-2 ml-auto">
                          <button
                            onClick={() => handleEditAddress(order)}
                            disabled={editingOrderId === order.id}
                            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            Edit Address
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingOrderId === order.id}
                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {deletingOrderId === order.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Delete Order
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Address Form */}
                  {editingOrderId === order.id && editingShippingInfo && (
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Edit Delivery Address
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={editingShippingInfo.address}
                            onChange={(e) =>
                              handleShippingInfoChange(
                                'address',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={editingShippingInfo.city}
                            onChange={(e) =>
                              handleShippingInfoChange('city', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            value={editingShippingInfo.postalCode}
                            onChange={(e) =>
                              handleShippingInfoChange(
                                'postalCode',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="10001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <input
                            type="text"
                            value={editingShippingInfo.country}
                            onChange={(e) =>
                              handleShippingInfoChange(
                                'country',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="United States"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={editingShippingInfo.phone}
                            onChange={(e) =>
                              handleShippingInfoChange('phone', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleUpdateAddress(order.id)}
                          disabled={updatingOrderId === order.id}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {updatingOrderId === order.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Save Address
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updatingOrderId === order.id}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Order Timeline */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                            [
                              'pending',
                              'processing',
                              'shipped',
                              'delivered',
                            ].includes(order.status)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                        <p>Ordered</p>
                      </div>
                      <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                      <div className="text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                            ['processing', 'shipped', 'delivered'].includes(
                              order.status
                            )
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                        <p>Processing</p>
                      </div>
                      <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                      <div className="text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                            ['shipped', 'delivered'].includes(order.status)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                        <p>Shipped</p>
                      </div>
                      <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                      <div className="text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                            order.status === 'delivered'
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                        <p>Delivered</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items &&
                    Array.isArray(order.items) &&
                    order.items.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Items:
                        </p>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4  p-3 rounded-lg"
                              style={{ backgroundColor: '#F0F8FF' }}
                            >
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.brand} - {item.model}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ${parseFloat(item.price).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  per item
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Additional Info */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.payment_method && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Payment Method:{' '}
                            <span className="font-medium text-gray-900">
                              {order.payment_method === 'cash_on_delivery'
                                ? 'Cash on Delivery'
                                : order.payment_method}
                            </span>
                          </p>
                        </div>
                      )}
                      {order.tracking_number && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Tracking Number:{' '}
                            <span className="font-medium text-gray-900">
                              {order.tracking_number}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    {order.shipping_address && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Delivery Address:
                        </p>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <p>{order.shipping_address}</p>
                          <p>
                            {order.shipping_city}, {order.shipping_postal_code}
                          </p>
                          <p>{order.shipping_country}</p>
                          <p className="mt-1">Phone: {order.shipping_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
