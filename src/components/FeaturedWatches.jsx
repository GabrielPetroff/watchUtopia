import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

import authService from '../services/auth/authService.js';
import cartService from '../services/cart/cartService.js';
import dataService from '../services/data/dataService.js';

function FeaturedWatches() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [latestReleases, setLatestReleases] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  // Fetch best sellers - most expensive watches from feauteredwatches table
  const fetchBestSellers = useCallback(async () => {
    try {
      const result = await dataService.getBestSellers(12);

      if (result.success) {
        setBestSellers(result.data);
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    }
  }, []);

  // Fetch latest releases from brands table (most recently added by ID)
  const fetchLatestReleases = useCallback(async () => {
    try {
      const result = await dataService.getLatestReleases(12);

      if (result.success) {
        setLatestReleases(result.data);
      }
    } catch (error) {
      console.error('Error fetching latest releases:', error);
    }
  }, []);

  // Fetch both on mount
  useEffect(() => {
    fetchBestSellers();
    fetchLatestReleases();
  }, [fetchBestSellers, fetchLatestReleases]);

  // Show notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  // Reusable add to cart function
  const handleAddToCart = useCallback(
    async (item) => {
      try {
        const user = await authService.getCurrentUser();

        if (!user) {
          showNotification('Please login to add items to cart', 'error');
          return;
        }

        const result = await cartService.addToCart(user.id, {
          id: item.id,
          model: item.model,
          brand: item.brand,
          price: item.price,
          image: item.image, // store the path, not the full URL
        });

        if (result.success) {
          showNotification(
            `${item.brand} ${item.model} added to cart!`,
            'success'
          );
        } else {
          showNotification('Failed to add to cart', 'error');
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
        showNotification('Failed to add to cart', 'error');
      }
    },
    [showNotification]
  );

  // Reusable watch item component
  const WatchItem = ({ item }) => (
    <li className="flex flex-col h-full text-sm tracking-widest group">
      <Link to={`/watch/${item.id}`} className="flex flex-col flex-grow">
        <div
          className="overflow-hidden rounded-lg 2xl:rounded-xl  aspect-square"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <img
            src={item.imageUrl}
            alt={`${item.brand} ${item.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col flex-grow space-y-1 2xl:space-y-2 mt-2 md:mt-3 2xl:mt-4">
          <h3 className="text-xs 2xl:text-sm text-gray-600">{item.brand}</h3>
          <h3 className="font-medium text-sm 2xl:text-base line-clamp-2 flex-grow">
            {item.model}
          </h3>
          <h3 className="font-semibold text-lg 2xl:text-xl">${item.price}</h3>
        </div>
      </Link>
      <button
        onClick={() => handleAddToCart(item)}
        className="mt-2 md:mt-3 2xl:mt-4 px-4 py-2 2xl:px-6 2xl:py-3 bg-[#161818] hover:bg-[#2a2c2c] text-white text-xs 2xl:text-sm uppercase w-full transition-colors duration-200"
      >
        Add to cart
      </button>
    </li>
  );

  const currentWatches =
    activeContentIndex === 0 ? bestSellers : latestReleases;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 2xl:px-12 pt-5 mb-6 space-y-4 md:space-y-6 2xl:space-y-8">
      {/* Toast Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg text-white text-sm md:text-base font-medium transition-all duration-300 max-w-[90%] md:max-w-md text-center ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold">
        Featured Watches
      </h2>
      <div className="w-full space-y-4 md:space-y-6 2xl:space-y-8">
        <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:gap-8 max-w-2xl mx-auto">
          <button
            className={`px-6 py-3 md:py-4 2xl:py-5 uppercase text-sm md:text-base 2xl:text-lg font-medium transition-colors duration-200 ${
              activeContentIndex === 0
                ? 'bg-[#161818] text-white'
                : 'border-2 border-[#161818] hover:bg-gray-50'
            }`}
            onClick={() => setActiveContentIndex(0)}
          >
            Best Sellers
          </button>
          <button
            className={`px-6 py-3 md:py-4 2xl:py-5 uppercase text-sm md:text-base 2xl:text-lg font-medium transition-colors duration-200 ${
              activeContentIndex === 1
                ? 'bg-[#161818] text-white'
                : 'border-2 border-[#161818] hover:bg-gray-50'
            }`}
            onClick={() => setActiveContentIndex(1)}
          >
            Latest Releases
          </button>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 2xl:gap-8">
          {currentWatches.map((item) => (
            <WatchItem key={item.id} item={item} />
          ))}
        </ul>

        <div className="flex justify-center">
          <Link
            to={
              activeContentIndex === 0
                ? '/products?sort=best-sellers'
                : '/products?sort=newest'
            }
            className="border-2 border-[#161818] hover:bg-[#161818] hover:text-white px-6 py-3 md:py-4 2xl:py-5 uppercase text-sm md:text-base 2xl:text-lg font-medium w-full max-w-2xl transition-colors duration-200 text-center"
          >
            {activeContentIndex === 0
              ? 'Shop all Best Sellers'
              : 'Shop all Latest Releases'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedWatches;
