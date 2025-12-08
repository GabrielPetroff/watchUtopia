import { Link } from 'react-router';
import { useState, useRef } from 'react';

function FeauturedBrands() {
  const sliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const watches = [
    {
      image: 'ap.png',
      brand: 'Audemars Piguet',
      linkTo: '/AudemarsPiguetPage',
    },
    {
      image: 'breitling.png',
      brand: 'Breitling',
      linkTo: '/BreitlingPage',
    },
    {
      image: 'cartier.png',
      brand: 'Cartier',
      linkTo: '/CartierPage',
    },
    { image: 'iwc.png', brand: 'IWC', linkTo: '/IwcPage' },
    {
      image: 'patek-philippe.png',
      brand: 'Patek Philippe',
      linkTo: '/PatekPhilippePage',
    },
    { image: 'omega.png', brand: 'Omega', linkTo: '/OmegaPage' },
    { image: 'rolex.png', brand: 'Rolex', linkTo: '/RolexPage' },
    {
      image: 'tag-heuer.png',
      brand: 'Tag Heuer',
      linkTo: '/TagheurPage',
    },
    { image: 'tudor.png', brand: 'Tudor', linkTo: '/TudorPage' },
    { image: 'vacheron.png', brand: 'Vacheron', linkTo: '/VacheronPage' },
    { image: 'oris.png', brand: 'Oris', linkTo: '/OrisPage' },
  ];

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
    <div className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto p-4 overflow-y-auto h-h-screen md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <h3 className="col-span-3 text-xs text-center uppercase md:col-span-4 lg:col-span-5 md:text-lg lg:text-xl">
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
          {watches.map((item, index) => (
            <Link key={index} to={item.linkTo}>
              <img
                className="w-[140px] h-fit inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
                src={item.image}
                alt={item.brand}
              />
            </Link>
          ))}
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
