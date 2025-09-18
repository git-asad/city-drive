import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { carAPI } from '../utils/api';
import LoadingSpinner from '../Components/LoadingSpinner';

const Cars = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);

  // Read search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Fetch cars from API
  const fetchCars = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        search: searchTerm,
        category: selectedCategory,
        location: selectedLocation,
        sortBy,
        sortOrder: sortBy === 'pricePerDay' ? 'desc' : 'asc',
        page: currentPage,
        limit: 12,
        ...params
      };

      // Convert price range to minPrice/maxPrice
      if (priceRange) {
        switch (priceRange) {
          case 'under-100':
            queryParams.maxPrice = 100;
            break;
          case '100-200':
            queryParams.minPrice = 100;
            queryParams.maxPrice = 200;
            break;
          case '200-300':
            queryParams.minPrice = 200;
            queryParams.maxPrice = 300;
            break;
          case 'over-300':
            queryParams.minPrice = 300;
            break;
        }
      }

      const response = await carAPI.getAll(queryParams);
      setCars(response.cars);
      setTotalPages(response.pagination.totalPages);
      setTotalCars(response.pagination.totalCars);
    } catch (err) {
      setError(err.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when filters change
  useEffect(() => {
    fetchCars();
  }, [searchTerm, selectedCategory, selectedLocation, priceRange, sortBy, currentPage]);

  // Get unique categories and locations for filters
  const categories = [...new Set(cars.map(car => car.category))];
  const locations = [...new Set(cars.map(car => car.location))];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPriceRange('');
    setSortBy('createdAt');
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Available Cars</h1>
            <p className='text-gray-600 mt-1'>Find your perfect car for any occasion</p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filters and Search */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
            {/* Search */}
            <div className='lg:col-span-2'>
              <input
                type='text'
                placeholder='Search by brand, model, or category...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Prices</option>
                <option value='under-100'>Under $100</option>
                <option value='100-200'>$100 - $200</option>
                <option value='200-300'>$200 - $300</option>
                <option value='over-300'>Over $300</option>
              </select>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                {totalCars} cars found
              </span>
              {(searchTerm || selectedCategory || selectedLocation || priceRange) && (
                <button
                  onClick={clearFilters}
                  className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='createdAt'>Newest First</option>
                <option value='pricePerDay'>Price: Low to High</option>
                <option value='pricePerDay'>Price: High to Low</option>
                <option value='year'>Newest Year</option>
              </select>

              <div className='flex border border-gray-300 rounded-lg'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <div className='text-center py-12'>
            <img src={assets.cautionIconColored} alt="Error" className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <h3 className='text-xl font-medium text-gray-900 mb-2'>Error loading cars</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => fetchCars()}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cars Display */}
        {!loading && !error && cars.length === 0 ? (
          <div className='text-center py-12'>
            <img src={assets.car_icon} alt="No cars" className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <h3 className='text-xl font-medium text-gray-900 mb-2'>No cars found</h3>
            <p className='text-gray-600 mb-4'>Try adjusting your search criteria or clearing filters.</p>
            <button
              onClick={clearFilters}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Clear All Filters
            </button>
          </div>
        ) : !loading && !error && (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {cars.map((car) => (
                <div
                  key={car._id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => navigate(`/car-details/${car._id}`)}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
                    <img
                      src={car.images?.[0] || car.image || assets.car_image1}
                      alt={`${car.brand} ${car.model}`}
                      className={`w-full object-cover ${viewMode === 'list' ? 'h-32' : 'h-full'}`}
                    />
                    <div className='absolute top-3 right-3'>
                      <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
                        Available
                      </span>
                    </div>
                    <div className='absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                      <span className='font-semibold'>${car.pricePerDay}</span>
                      <span className='text-sm text-white/80'> / day</span>
                    </div>
                  </div>

                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className='flex justify-between items-start mb-3'>
                      <div>
                        <h3 className='text-xl font-bold text-gray-900 mb-1'>
                          {car.brand} {car.model}
                        </h3>
                        <p className='text-gray-600 text-sm'>{car.category} • {car.year}</p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-2 text-gray-600 mb-4'>
                      <div className='flex items-center text-sm'>
                        <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.seating_capacity} Seats</span>
                      </div>
                      <div className='flex items-center text-sm'>
                        <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.fuel_type}</span>
                      </div>
                      <div className='flex items-center text-sm'>
                        <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.transmission}</span>
                      </div>
                      <div className='flex items-center text-sm'>
                        <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/booking/${car._id}`);
                      }}
                      className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium relative group'
                      title={`${car.brand} ${car.model} - ${car.category} • ${car.seating_capacity} seats • ${car.fuel_type} • ${car.transmission} • ${car.location} • $${car.pricePerDay}/day`}
                    >
                      Book Now
                      {/* Hover Tooltip */}
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                        <div className='text-center'>
                          <div className='font-semibold'>{car.brand} {car.model}</div>
                          <div className='text-xs text-gray-300 mt-1'>
                            {car.seating_capacity} seats • {car.fuel_type} • {car.year}
                          </div>
                          <div className='text-xs text-gray-300'>
                            {car.location} • ${car.pricePerDay}/day
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center mt-8'>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;
