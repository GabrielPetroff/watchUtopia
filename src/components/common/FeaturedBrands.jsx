import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';

import dataService from '../../services/data/dataService.js';

function FeauturedBrands() {
  const sliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    const result = await dataService.getBrandLogos();

    if (result.success) {
      setBrands(result.data);
    } else {
      console.error('Error loading brands:', result.error);
    }

    setLoading(false);
  };

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollAmount = 300;
      slider.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateButtonVisibility = () => {
    const slider = sliderRef.current;
    if (slider) {
      setShowLeftButton(slider.scrollLeft > 0);
      setShowRightButton(
        slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <h3 className="col-span-3 text-sm sm:text-base text-center uppercase md:col-span-4 lg:col-span-5 md:text-lg lg:text-xl mb-4">
        Shop popular brands
      </h3>

      <div className="relative w-full col-span-full group">
        {/* Left Navigation Button */}
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#161818] hover:bg-[#2a2c2c] text-white shadow-2xl rounded-full p-4 transition-all duration-200 items-center justify-center opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <svg
              className="w-7 h-7"
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
          ref={sliderRef}
          onScroll={updateButtonVisibility}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth col-span-full scrollbar-hide px-12 md:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading ? (
            <div className="text-center py-4">Loading brands...</div>
          ) : (
            brands.map((item, index) => (
              <Link
                key={index}
                to={`/products?brand=${encodeURIComponent(item.brand)}`}
              >
                <img
                  className="w-[140px] h-fit inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
                  src={item.image}
                  alt={item.brand}
                />
              </Link>
            ))
          )}
        </div>

        {/* Right Navigation Button */}
        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#161818] hover:bg-[#2a2c2c] text-white shadow-2xl rounded-full p-4 transition-all duration-200 items-center justify-center opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <svg
              className="w-7 h-7"
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
    </div>
  );
}

export default FeauturedBrands;
