import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';

import dataService from '../../services/data/dataService.js';

export default function ProductsPage() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const sliderRef = useRef(null);
  const tagSliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [showTagLeftButton, setShowTagLeftButton] = useState(false);
  const [showTagRightButton, setShowTagRightButton] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadWatches();

    // Check if there's a brand parameter in the URL
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }

    // Check if there's a sort parameter in the URL
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  const loadWatches = async () => {
    setLoading(true);
    const result = await dataService.getAllProducts();

    if (result.success) {
      setWatches(result.data);
      setError(null);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Get unique brands for filter
  const brands = [...new Set(watches.map((watch) => watch.brand))].sort();

  // Get unique tags for selected brand
  const tags =
    selectedBrand === 'all'
      ? []
      : [
          ...new Set(
            watches
              .filter((watch) => watch.brand === selectedBrand && watch.tag)
              .map((watch) => watch.tag)
          ),
        ].sort();

  // Reset tag selection when brand changes
  useEffect(() => {
    setSelectedTag('all');
    setCurrentPage(1);
  }, [selectedBrand]);

  // Reset to page 1 when tag or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, sortBy]);

  // Filter and sort watches
  const filteredAndSortedWatches = watches
    .filter((watch) => {
      const matchesBrand =
        selectedBrand === 'all' || watch.brand === selectedBrand;
      const matchesTag = selectedTag === 'all' || watch.tag === selectedTag;
      return matchesBrand && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'best-sellers':
          return (b.times_bought || 0) - (a.times_bought || 0); // Best sellers sorted by times bought
        case 'newest':
          return b.id - a.id; // Newest sorted by ID descending
        default:
          return 0;
      }
    });

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

  const scrollTag = (direction) => {
    const slider = tagSliderRef.current;
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

  const updateTagButtonVisibility = () => {
    const slider = tagSliderRef.current;
    if (slider) {
      setShowTagLeftButton(slider.scrollLeft > 0);
      setShowTagRightButton(
        slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading watches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Error: {error}</p>
          <button
            onClick={loadWatches}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#F0F8FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Watch Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover our exquisite selection of luxury timepieces
          </p>
        </div>

        {/* Brand Slider */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Filter by Brand
          </h2>
          <div className="relative group">
            {/* Left Navigation Button */}
            {showLeftButton && (
              <button
                onClick={() => scroll('left')}
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
              ref={sliderRef}
              onScroll={updateButtonVisibility}
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
                    ? 'bg-[#161818] text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0D0E0E] hover:text-[#0D0E0E]'
                }`}
              >
                All Brands
              </button>

              {/* Brand Buttons */}
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedBrand === brand
                      ? 'bg-[#161818] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0D0E0E] hover:text-[#0D0E0E]'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Right Navigation Button */}
            {showRightButton && (
              <button
                onClick={() => scroll('right')}
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
        </div>

        {/* Tag Slider - Only show when a brand is selected */}
        {selectedBrand !== 'all' && tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Filter by Collection
            </h2>
            <div className="relative group">
              {/* Left Navigation Button */}
              {showTagLeftButton && (
                <button
                  onClick={() => scrollTag('left')}
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
                ref={tagSliderRef}
                onScroll={updateTagButtonVisibility}
                className="overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide flex gap-3 py-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {/* All Tags Button */}
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedTag === 'all'
                      ? 'bg-[#161818] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0D0E0E] hover:text-[#0D0E0E]'
                  }`}
                >
                  All Collections
                </button>

                {/* Tag Buttons */}
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedTag === tag
                        ? 'bg-[#161818] text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0D0E0E] hover:text-[#0D0E0E]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Right Navigation Button */}
              {showTagRightButton && (
                <button
                  onClick={() => scrollTag('right')}
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
          </div>
        )}

        {/* Sorting and Results */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Results count */}
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedWatches.length} of {watches.length}{' '}
            watches
          </p>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent "
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <option value="newest">Newest First</option>
              <option value="best-sellers">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedWatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No watches found matching your criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedWatches
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((watch) => (
                  <Link
                    key={watch.id}
                    to={`/watch/${watch.id}`}
                    className="group  rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    style={{ backgroundColor: '#F0F8FF' }}
                  >
                    {/* Image */}
                    <div
                      className="aspect-square overflow-hidden "
                      style={{ backgroundColor: '#F0F8FF' }}
                    >
                      <img
                        src={watch.imageUrl}
                        alt={`${watch.brand} ${watch.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">
                        {watch.brand}
                      </h3>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {watch.model}
                      </h2>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-900">
                          ${watch.price?.toLocaleString()}
                        </p>
                        <span className="text-sm text-gray-600 group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedWatches.length > itemsPerPage && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                  {
                    length: Math.ceil(
                      filteredAndSortedWatches.length / itemsPerPage
                    ),
                  },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-[#161818] text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(
                          filteredAndSortedWatches.length / itemsPerPage
                        )
                      )
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredAndSortedWatches.length / itemsPerPage)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
