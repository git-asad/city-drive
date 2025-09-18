import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { bookingAPI, getAuthToken } from '../utils/api';
import LoadingSpinner from '../Components/LoadingSpinner';

const MyBookings = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load bookings from API
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        // For demo purposes, show mock bookings since we removed authentication
        // In a real app, you'd filter by user or show all bookings
        const mockBookings = [
          {
            _id: '1',
            car: {
              brand: 'BMW',
              model: 'X5',
              images: ['/src/assets/bmw_new.png'],
              pricePerDay: 85
            },
            pickupDate: '2025-01-15',
            returnDate: '2025-01-18',
            pickupLocation: 'New York',
            status: 'confirmed',
            totalCost: 340,
            days: 3,
            createdAt: '2025-01-10T10:00:00Z',
            driverInfo: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890'
            }
          },
          {
            _id: '2',
            car: {
              brand: 'Mercedes',
              model: 'C-Class',
              images: ['/src/assets/car_image1.png'],
              pricePerDay: 75
            },
            pickupDate: '2025-01-20',
            returnDate: '2025-01-22',
            pickupLocation: 'Los Angeles',
            status: 'pending',
            totalCost: 150,
            days: 2,
            createdAt: '2025-01-12T14:30:00Z',
            driverInfo: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              phone: '+1234567891'
            }
          }
        ];
        setBookings(mockBookings);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [filterStatus]);

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter(booking => !filterStatus || booking.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return assets.check_icon;
      case 'pending':
        return assets.calendar_icon_colored;
      case 'cancelled':
        return assets.delete_icon;
      default:
        return assets.car_icon;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center'>
          <div className='text-red-600 mb-4'>
            <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>Error Loading Bookings</h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>My Bookings</h1>
            <p className='text-gray-600 mt-1'>Manage your car rental reservations</p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filters and Stats */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <div className='flex items-center gap-4'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Bookings</option>
                <option value='pending'>Pending</option>
                <option value='confirmed'>Confirmed</option>
                <option value='cancelled'>Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='newest'>Newest First</option>
                <option value='oldest'>Oldest First</option>
              </select>
            </div>

            <div className='text-sm text-gray-600'>
              {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{bookings.length}</div>
              <div className='text-sm text-blue-800'>Total Bookings</div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className='text-sm text-green-800'>Confirmed</div>
            </div>
            <div className='text-center p-4 bg-yellow-50 rounded-lg'>
              <div className='text-2xl font-bold text-yellow-600'>
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className='text-sm text-yellow-800'>Pending</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-600'>
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className='text-sm text-red-800'>Cancelled</div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredAndSortedBookings.length === 0 ? (
          <div className='text-center py-12'>
            <img src={assets.car_icon} alt="No bookings" className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <h3 className='text-xl font-medium text-gray-900 mb-2'>No bookings found</h3>
            <p className='text-gray-600 mb-6'>You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/cars')}
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            {filteredAndSortedBookings.map((booking) => (
              <div key={booking._id} className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
                <div className='p-6'>
                  <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Car Image and Basic Info */}
                    <div className='lg:w-1/3'>
                      <div className='flex items-center gap-4 mb-4'>
                        <img
                          src={booking.car.images?.[0] || booking.car.image || assets.car_image1}
                          alt={`${booking.car.brand} ${booking.car.model}`}
                          className='w-20 h-20 object-cover rounded-lg'
                        />
                        <div>
                          <h3 className='text-xl font-bold text-gray-900'>
                            {booking.car.brand} {booking.car.model}
                          </h3>
                          <p className='text-gray-600'>{booking.pickupLocation || booking.car.location}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className='flex items-center gap-2 mb-4'>
                        <img src={getStatusIcon(booking.status)} alt="Status" className='w-5 h-5' />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className='lg:w-2/3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div className='bg-gray-50 rounded-lg p-4'>
                          <h4 className='font-semibold text-gray-900 mb-2'>Pickup Details</h4>
                          <p className='text-sm text-gray-600'>Date: {formatDate(booking.pickupDate)}</p>
                          <p className='text-sm text-gray-600'>Location: {booking.pickupLocation || booking.car.location}</p>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-4'>
                          <h4 className='font-semibold text-gray-900 mb-2'>Return Details</h4>
                          <p className='text-sm text-gray-600'>Date: {formatDate(booking.returnDate)}</p>
                          <p className='text-sm text-gray-600'>Location: {booking.pickupLocation || booking.car.location}</p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      {booking.customerInfo && (
                        <div className='bg-blue-50 rounded-lg p-4 mb-4'>
                          <h4 className='font-semibold text-gray-900 mb-2'>Customer Information</h4>
                          <p className='text-sm text-gray-600'>Name: {booking.customerInfo.firstName} {booking.customerInfo.lastName}</p>
                          <p className='text-sm text-gray-600'>Email: {booking.customerInfo.email}</p>
                          <p className='text-sm text-gray-600'>Phone: {booking.customerInfo.phone}</p>
                        </div>
                      )}

                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                        <div>
                          <p className='text-sm text-gray-600'>
                            Booked on: {formatDate(booking.createdAt)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Booking ID: {booking._id.slice(-8)}
                          </p>
                        </div>

                        <div className='text-right'>
                          <div className='text-2xl font-bold text-blue-600 mb-1'>
                            {formatCurrency(booking.price)}
                          </div>
                          <p className='text-sm text-gray-600'>Total Amount</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex gap-3 mt-4'>
                        <button
                          onClick={() => navigate(`/car-details/${booking.car._id}`)}
                          className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'
                        >
                          View Car Details
                        </button>

                        {booking.status === 'confirmed' && (
                          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                            Download Receipt
                          </button>
                        )}

                        {booking.status === 'pending' && (
                          <div className='text-sm text-yellow-600 font-medium'>
                            Waiting for owner approval
                          </div>
                        )}

                        {booking.status === 'cancelled' && (
                          <div className='text-sm text-red-600 font-medium'>
                            Booking cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className='mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center'>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>Need Help with Your Booking?</h3>
          <p className='text-gray-600 mb-6'>Our customer support team is here to assist you 24/7</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
              Contact Support
            </button>
            <button
              onClick={() => navigate('/cars')}
              className='px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium'
            >
              Book Another Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
