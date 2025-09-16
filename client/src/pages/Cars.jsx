import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets, dummyCarData } from '../assets/assets';
import { carServices, bookingServices } from '../services/firebaseServices';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Cars = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
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


  // Fetch cars from Firebase
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all cars from Firebase
      const allCars = await carServices.getAllCars();

      // If dates are selected, get bookings to check availability
      let availableCars = [...allCars];
      if (pickupDate && returnDate) {
        try {
          const allBookings = await bookingServices.getAllBookings();
          const pickup = new Date(pickupDate);
          const returnD = new Date(returnDate);

          // Filter out cars that have conflicting bookings
          availableCars = allCars.filter(car => {
            const carBookings = allBookings.filter(booking =>
              booking.carId === car.id &&
              (booking.status === 'confirmed' || booking.status === 'pending')
            );

            // Check if any booking conflicts with the requested dates
            const hasConflict = carBookings.some(booking => {
              const bookingStart = new Date(booking.startDate?.toDate?.() || booking.startDate);
              const bookingEnd = new Date(booking.endDate?.toDate?.() || booking.endDate);

              // Check for date overlap
              return (pickup <= bookingEnd && returnD >= bookingStart);
            });

            return !hasConflict;
          });
        } catch (bookingError) {
          console.warn('Could not fetch bookings for availability check:', bookingError);
          // Continue with all cars if booking fetch fails
        }
      }

      // Apply client-side filtering
      let filteredCars = [...availableCars];

      // Apply search filter
      if (searchTerm) {
        filteredCars = filteredCars.filter(car =>
          car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter
      if (selectedCategory) {
        filteredCars = filteredCars.filter(car => car.category === selectedCategory);
      }

      // Apply location filter
      if (selectedLocation) {
        filteredCars = filteredCars.filter(car => car.location === selectedLocation);
      }

      // Apply price range filter
      if (priceRange) {
        filteredCars = filteredCars.filter(car => {
          const price = car.pricePerDay;
          switch (priceRange) {
            case 'under-100':
              return price < 100;
            case '100-200':
              return price >= 100 && price <= 200;
            case '200-300':
              return price >= 200 && price <= 300;
            case 'over-300':
              return price > 300;
            default:
              return true;
          }
        });
      }

      // Apply sorting
      filteredCars.sort((a, b) => {
        switch (sortBy) {
          case 'pricePerDay':
            return a.pricePerDay - b.pricePerDay;
          case 'year':
            return (b.year || 0) - (a.year || 0);
          case 'createdAt':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });

      // Apply pagination
      const startIndex = (currentPage - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedCars = filteredCars.slice(startIndex, endIndex);

      setCars(paginatedCars);
      setTotalPages(Math.ceil(filteredCars.length / 12));
      setTotalCars(filteredCars.length);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when filters change
  useEffect(() => {
    fetchCars();
  }, [searchTerm, selectedCategory, selectedLocation, pickupDate, returnDate, priceRange, sortBy, currentPage]);

  // Refresh data when window regains focus (in case visibility was changed in ManageCars)
  useEffect(() => {
    const handleFocus = () => {
      fetchCars();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Get unique categories and locations for filters
  const categories = [...new Set(cars.map(car => car.category))];
  const locations = [...new Set(cars.map(car => car.location))];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPickupDate('');
    setReturnDate('');
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-4'>
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

            {/* Pickup Date */}
            <div>
              <input
                type='date'
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Pickup Date'
              />
            </div>

            {/* Return Date */}
            <div>
              <input
                type='date'
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Return Date'
              />
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
              {(searchTerm || selectedCategory || selectedLocation || pickupDate || returnDate || priceRange) && (
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
                  key={car.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => navigate(`/car-details/${car.id}`)}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
                    <img
                      src={car.images?.[0] || car.image || assets.car_image1}
                      alt={`${car.name} ${car.model}`}
                      loading="lazy"
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
                          {car.name} {car.model}
                        </h3>
                        <p className='text-gray-600 text-sm'>{car.category} • {car.year}</p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-2 text-gray-600 mb-4'>
                      <div className='flex items-center text-sm'>
                        <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.seatingCapacity || car.seating_capacity} Seats</span>
                      </div>
                      <div className='flex items-center text-sm'>
                        <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                        <span>{car.fuelType || car.fuel_type}</span>
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
                        if (!isAuthenticated()) {
                          // Redirect to login with booking URL as return URL
                          navigate('/login', {
                            state: {
                              from: `/booking/${car.id}`,
                              message: 'You must sign in before booking a car.'
                            },
                            replace: true
                          });
                        } else {
                          navigate(`/booking/${car.id}`);
                        }
                      }}
                      className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium relative group'
                      title={`${car.name} ${car.model} - ${car.category} • ${car.seatingCapacity || car.seating_capacity} seats • ${car.fuelType || car.fuel_type} • ${car.transmission} • ${car.location} • $${car.pricePerDay}/day`}
                    >
                      {isAuthenticated() ? 'Book Now' : 'Sign In to Book'}
                      {/* Hover Tooltip */}
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                        <div className='text-center'>
                          <div className='font-semibold'>{car.name} {car.model}</div>
                          <div className='text-xs text-gray-300 mt-1'>
                            {car.seatingCapacity || car.seating_capacity} seats • {car.fuelType || car.fuel_type} • {car.year}
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
