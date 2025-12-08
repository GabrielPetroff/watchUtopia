import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { fetchAllWatches } from '../services/productService';

export default function ProductsPage() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadWatches();
  }, []);

  const loadWatches = async () => {
    setLoading(true);
    const result = await fetchAllWatches();

    if (result.success) {
      setWatches(result.data);
      setError(null);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Get unique brands for filter
  const brands = ['all', ...new Set(watches.map((watch) => watch.brand))];

  // Filter watches based on search and brand selection
  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      watch.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watch.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrand === 'all' || watch.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

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
    <div className="min-h-screen bg-gray-50 py-12">
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

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            {/* Brand Filter */}
            <div className="md:w-64">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600">
            Showing {filteredWatches.length} of {watches.length} watches
          </p>
        </div>

        {/* Products Grid */}
        {filteredWatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No watches found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWatches.map((watch) => (
              <Link
                key={watch.id}
                to={`/watch/${watch.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
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
                    <p className="text-xl font-bold text-indigo-600">
                      ${watch.price?.toLocaleString()}
                    </p>
                    <span className="text-sm text-indigo-600 group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
