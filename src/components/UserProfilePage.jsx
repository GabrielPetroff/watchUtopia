import { useState, useEffect } from 'react';
import orderService from '../services/order/orderService';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export default function UserProfilePage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

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
      const result = await orderService.getUserOrders(user.id);
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
      const result = await orderService.getUserOrderStats(user.id);
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
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

            <div className="bg-white rounded-lg shadow-md p-6">
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

            <div className="bg-white rounded-lg shadow-md p-6">
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

            <div className="bg-white rounded-lg shadow-md p-6">
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
        <div className="bg-white rounded-lg shadow-md p-6">
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
                    <div>
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
                    </div>
                  </div>

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
                              className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
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
                  {order.tracking_number && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-gray-600">
                        Tracking Number:{' '}
                        <span className="font-medium text-gray-900">
                          {order.tracking_number}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
