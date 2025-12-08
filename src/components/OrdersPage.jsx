import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import authService from '../services/auth/authServive.js';
import orderService from '../services/order/orderService.js';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Load orders
        const ordersResult = await orderService.getUserOrders(currentUser.id);
        if (ordersResult.success) {
          setOrders(ordersResult.data || []);
        }

        // Load stats
        const statsResult = await orderService.getUserOrderStats(
          currentUser.id
        );
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

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
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sign in to view and manage your orders
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {/* Order Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
              <Package className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingOrders}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.deliveredOrders}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <Package className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to create your first order
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.order_date)}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-left sm:text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.order_items?.length || 0} item(s)
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.order_items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.product_image_url && (
                            <img
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.product_brand} {item.product_model}
                            </p>
                            <p className="text-sm text-gray-700">
                              Qty: {item.quantity} ×{' '}
                              {formatCurrency(item.price_at_purchase)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.order_items.length > 3 && (
                      <p className="text-sm text-gray-600 mt-3">
                        +{order.order_items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Tracking Info */}
                {order.tracking_number && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">Tracking Number:</span>{' '}
                      {order.tracking_number}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?.id === order.id ? null : order
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    {selectedOrder?.id === order.id
                      ? 'Hide Details'
                      : 'View Details'}
                  </button>
                  {['pending', 'processing'].includes(order.status) && (
                    <button
                      onClick={async () => {
                        if (
                          confirm('Are you sure you want to cancel this order?')
                        ) {
                          const result = await orderService.cancelOrder(
                            order.id
                          );
                          if (result.success) {
                            setOrders(
                              orders.map((o) =>
                                o.id === order.id
                                  ? { ...o, status: 'cancelled' }
                                  : o
                              )
                            );
                          }
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* Detailed View */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.shipping_address}</p>
                          <p>
                            {order.shipping_city}, {order.shipping_postal_code}
                          </p>
                          <p>{order.shipping_country}</p>
                          {order.shipping_phone && (
                            <p>Phone: {order.shipping_phone}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Order Information
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Payment Method:</span>{' '}
                            {order.payment_method || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Payment Status:</span>{' '}
                            {order.payment_status}
                          </p>
                          {order.shipped_at && (
                            <p>
                              <span className="font-medium">Shipped:</span>{' '}
                              {formatDate(order.shipped_at)}
                            </p>
                          )}
                          {order.delivered_at && (
                            <p>
                              <span className="font-medium">Delivered:</span>{' '}
                              {formatDate(order.delivered_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {order.customer_notes && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Customer Notes
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.customer_notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
