import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../services/api/supabaseClient';
import authService from '../services/auth/authServive.js';
import wishlistService from '../services/wishlist/wishlistService.js';
import { Heart } from 'lucide-react';

function WatchDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchWatchDetails = async () => {
      try {
        setLoading(true);

        // Get current user
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        // Try fetching from feauteredwatches table first
        let { data, error: fetchError } = await supabase
          .from('feauteredwatches')
          .select('*')
          .eq('id', id)
          .single();

        // If not found, try brands table
        if (!data || fetchError) {
          const result = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();

          data = result.data;
          fetchError = result.error;
        }

        if (fetchError) throw fetchError;

        if (data) {
          // Clean the image path - remove 'watches/' or 'img/' prefix if present
          let cleanImagePath = data.image;
          if (cleanImagePath.startsWith('watches/')) {
            cleanImagePath = cleanImagePath.replace('watches/', '');
          } else if (cleanImagePath.startsWith('img/')) {
            cleanImagePath = cleanImagePath.replace('img/', '');
          }

          // Get public URL for the image
          const {
            data: { publicUrl },
          } = supabase.storage.from('watches').getPublicUrl(cleanImagePath);

          const watchData = {
            ...data,
            imageUrl: publicUrl,
          };

          setWatch(watchData);

          // Check if in wishlist
          if (currentUser) {
            const wishlistCheck = await wishlistService.isInWishlist(
              currentUser.id,
              id
            );
            setIsInWishlist(wishlistCheck.isInWishlist);
          }
        } else {
          setError('Watch not found');
        }
      } catch (err) {
        console.error('Error fetching watch details:', err);
        setError('Failed to load watch details');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const { error } = await supabase.from('orders').insert([
        {
          model: watch.model,
          brand: watch.brand,
          price: watch.price,
          image: watch.image,
        },
      ]);

      if (error) throw error;
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const result = await wishlistService.removeFromWishlistByWatchId(
          user.id,
          id
        );
        if (result.success) {
          setIsInWishlist(false);
          alert('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        const result = await wishlistService.addToWishlist(user.id, id, {
          name: watch.model,
          price: watch.price,
          image_url: watch.imageUrl,
        });
        if (result.success) {
          setIsInWishlist(true);
          alert('Added to wishlist!');
        } else {
          alert(result.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      alert('An error occurred');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-xl text-red-600">{error || 'Watch not found'}</div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#161818] text-white uppercase text-sm hover:bg-[#2a2c2c] transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 2xl:px-12 py-8 md:py-12 2xl:py-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 md:mb-8 text-gray-600 hover:text-black flex items-center gap-2 text-sm md:text-base"
      >
        <span>←</span> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 2xl:gap-16">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg 2xl:rounded-xl overflow-hidden">
            <img
              src={watch.imageUrl}
              alt={`${watch.brand} ${watch.model}`}
              className="w-full h-auto object-cover"
              onError={() => {
                console.error('Image failed to load:', watch.imageUrl);
              }}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold">
              {watch.model}
            </h1>
            <h2 className="text-xl md:text-2xl 2xl:text-3xl text-gray-600">
              {watch.brand}
            </h2>
            <div className="text-2xl md:text-3xl 2xl:text-4xl font-semibold">
              ${watch.price}
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-b border-gray-200 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
              <div>
                <span className="text-gray-600 uppercase tracking-wider text-xs">
                  Brand
                </span>
                <p className="font-medium mt-1">{watch.brand}</p>
              </div>
              <div>
                <span className="text-gray-600 uppercase tracking-wider text-xs">
                  Model
                </span>
                <p className="font-medium mt-1">{watch.model}</p>
              </div>
            </div>
          </div>

          {/* Description if available */}
          {watch.description && (
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {watch.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-4 md:py-5 bg-[#161818] text-white uppercase text-sm md:text-base font-medium hover:bg-[#2a2c2c] transition-colors duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`w-full px-6 py-4 md:py-5 border-2 uppercase text-sm md:text-base font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                isInWishlist
                  ? 'border-red-500 text-red-600 hover:bg-red-50'
                  : 'border-[#161818] hover:bg-gray-50'
              } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {wishlistLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
              ) : (
                <>
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                  />
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchDetailsPage;
