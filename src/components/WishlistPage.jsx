import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import authService from '../services/auth/authServive.js';
import wishlistService from '../services/wishlist/wishlistService.js';
import { Heart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWishlist() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const result = await wishlistService.getWishlist(currentUser.id);
        if (result.success) {
          setWishlistItems(result.data || []);
        }
      }

      setLoading(false);
    }

    loadWishlist();
  }, []);

  const handleRemove = async (itemId) => {
    setRemoving(itemId);
    const result = await wishlistService.removeFromWishlist(itemId);

    if (result.success) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
    }

    setRemoving(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, show login/register options
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sign in to view and manage your wishlist
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

  // If authenticated but empty wishlist
  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding watches you love to your wishlist
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Browse Watches
          </Link>
        </div>
      </div>
    );
  }

  // Display wishlist items
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              {item.product_image_url && (
                <img
                  src={item.product_image_url}
                  alt={item.product_name || 'Watch'}
                  className="w-full h-64 object-cover"
                />
              )}
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removing === item.id}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Remove from wishlist"
              >
                {removing === item.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="w-5 h-5 text-red-600" />
                )}
              </button>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.product_name || 'Watch Name'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.product_brand || 'Brand'}
                {item.product_model && ` - ${item.product_model}`}
              </p>
              {item.product_price && (
                <p className="text-xl font-bold text-indigo-600 mb-4">
                  ${parseFloat(item.product_price).toFixed(2)}
                </p>
              )}
              <button
                onClick={() => navigate(`/watch/${item.product_id}`)}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
