
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { bookingServices } from '../services/firebaseServices';

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  // Removed tab and booking creation state - only showing bookings list now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Removed bookingData state - no longer needed for booking creation

  // Authentication is handled by ProtectedRoute, no need for additional check

  // Load existing bookings
  useEffect(() => {
    loadBookings();
  }, [user]);

  // Removed car loading for booking creation - no longer needed

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user bookings from Firebase
      console.log('📊 Loading user bookings from Firebase...');
      const userBookings = await bookingServices.getUserBookings(user.id);

      console.log(`✅ Loaded ${userBookings.length} bookings for user ${user?.email || user?.id}`);
      setBookings(userBookings);

    } catch (err) {
      console.error('❌ Error loading bookings:', err);
      setError('Failed to load bookings. Please refresh the page or contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Removed fetchCar function - no longer needed for booking creation

  // Removed all booking creation functions - no longer needed

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => !filterStatus || booking.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt?.toDate?.() || a.createdAt) - new Date(b.createdAt?.toDate?.() || b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt);
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
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'canceled_by_owner': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return assets.check_icon;
      case 'pending': return assets.calendar_icon_colored;
      case 'cancelled': return assets.delete_icon;
      case 'canceled_by_owner': return assets.cautionIconColored;
      default: return assets.car_icon;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        console.log(`🗑️ User cancelling booking ${bookingId}`);

        // Cancel booking in Firebase
        await bookingServices.updateBookingStatus(bookingId, 'cancelled');

        // Reload user's bookings to reflect the cancellation
        await loadBookings();

        console.log(`✅ Booking ${bookingId} cancelled successfully`);
        alert('✅ Booking cancelled successfully!');
      } catch (error) {
        console.error('❌ Error in cancellation process:', error);
        alert('❌ Failed to cancel booking. Please try again.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Bookings</h1>
          <p className='text-gray-600'>Manage your car rental bookings and reservations</p>
        </div>

        {/* Booking Statistics */}
        <div className='mb-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
          {(() => {
            // Calculate stats from Firebase bookings
            const totalBookings = bookings.length;
            const pendingBookings = bookings.filter(b => b.status === 'pending').length;
            const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
            const totalSpent = bookings
              .filter(b => b.status === 'confirmed')
              .reduce((sum, b) => sum + (b.totalPrice || b.price || 0), 0);

            return (
              <>
                <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>{totalBookings}</div>
                  <div className='text-gray-600'>Total Bookings</div>
                </div>
                <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                  <div className='text-3xl font-bold text-yellow-600 mb-2'>{pendingBookings}</div>
                  <div className='text-gray-600'>Pending Confirmation</div>
                </div>
                <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                  <div className='text-3xl font-bold text-green-600 mb-2'>{confirmedBookings}</div>
                  <div className='text-gray-600'>Confirmed</div>
                </div>
                <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>${totalSpent.toFixed(2)}</div>
                  <div className='text-gray-600'>Total Spent</div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Bookings List */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          {/* Filters */}
          <div className='p-6 border-b border-gray-200'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>All Statuses</option>
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='cancelled'>Cancelled</option>
                  <option value='canceled_by_owner'>Canceled by Owner</option>
                </select>
              </div>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='newest'>Newest First</option>
                  <option value='oldest'>Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className='divide-y divide-gray-200'>
            {filteredAndSortedBookings.length === 0 ? (
              <div className='p-8 text-center'>
                <img src={assets.car_icon} alt="No bookings" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No bookings found</h3>
                <p className='text-gray-500 mb-4'>You haven't made any bookings yet.</p>
                <button
                  onClick={() => navigate('/cars')}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Browse Cars
                </button>
              </div>
            ) : (
              filteredAndSortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => openBookingDetails(booking)}
                  className='p-6 hover:bg-gray-50 transition-colors cursor-pointer'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <img
                        src={assets.main_car}
                        alt={booking.carName || 'Car'}
                        loading="lazy"
                        className='w-16 h-16 object-cover rounded-lg'
                      />
                      <div className='text-left'>
                        <h3 className='text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors'>
                          {booking.carName || 'Car'}
                        </h3>
                        <p className='text-sm text-gray-600'>{booking.carModel || ''}</p>
                        <div className='flex items-center space-x-4 mt-1'>
                          <span className='text-sm text-gray-500'>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                          <span className='text-sm text-gray-500'>{booking.days} days</span>
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        <img src={getStatusIcon(booking.status)} alt={booking.status} className="w-4 h-4 mr-2" />
                        {booking.status === 'canceled_by_owner' ? 'Canceled by Owner' :
                         booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                      <p className={`text-lg font-semibold mt-2 ${
                        booking.status === 'canceled_by_owner' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      {booking.status === 'canceled_by_owner' && booking.refundAmount && (
                        <p className='text-sm text-green-600 font-medium mt-1'>
                          Refunded: {formatCurrency(booking.refundAmount)}
                        </p>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.id);
                          }}
                          className='mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors'
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
              <div className='p-8'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>Booking Details</h2>
                  <button
                    onClick={closeBookingDetails}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
                  </button>
                </div>

                {/* Car Details */}
                <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Car Information</h3>
                  <div className='flex items-center space-x-6'>
                    <img
                      src={selectedBooking.car?.image || assets.main_car}
                      alt={selectedBooking.car?.name || 'Car'}
                      loading="lazy"
                      className='w-32 h-32 object-cover rounded-lg shadow-md'
                    />
                    <div className='flex-1'>
                      <h4 className='text-2xl font-bold text-gray-900 mb-2'>
                        {selectedBooking.car?.brand} {selectedBooking.car?.model}
                      </h4>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='font-medium text-gray-700'>Category:</span>
                          <span className='ml-2 text-gray-600'>{selectedBooking.car?.category}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Year:</span>
                          <span className='ml-2 text-gray-600'>{selectedBooking.car?.year}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Fuel Type:</span>
                          <span className='ml-2 text-gray-600'>{selectedBooking.car?.fuel_type}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Transmission:</span>
                          <span className='ml-2 text-gray-600'>{selectedBooking.car?.transmission}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Seating:</span>
                          <span className='ml-2 text-gray-600'>{selectedBooking.car?.seating_capacity} seats</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Daily Rate:</span>
                          <span className='ml-2 text-blue-600 font-semibold'>
                            {formatCurrency(selectedBooking.car?.pricePerDay)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className='bg-blue-50 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Booking Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                      <div>
                        <span className='font-medium text-gray-700'>Booking ID:</span>
                        <span className='ml-2 text-gray-600'>{selectedBooking.id}</span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Pickup Date:</span>
                        <span className='ml-2 text-gray-600'>{formatDate(selectedBooking.startDate)}</span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Return Date:</span>
                        <span className='ml-2 text-gray-600'>{formatDate(selectedBooking.endDate)}</span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Duration:</span>
                        <span className='ml-2 text-gray-600'>{selectedBooking.days} days</span>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div>
                        <span className='font-medium text-gray-700'>Pickup Location:</span>
                        <span className='ml-2 text-gray-600'>{selectedBooking.location}</span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Insurance:</span>
                        <span className='ml-2 text-gray-600'>
                          {selectedBooking.insurance ? 'Included' : 'Not Included'}
                        </span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Total Amount:</span>
                        <span className='ml-2 text-blue-600 font-bold text-lg'>
                          {formatCurrency(selectedBooking.totalPrice)}
                        </span>
                      </div>
                      <div>
                        <span className='font-medium text-gray-700'>Status:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                          <img src={getStatusIcon(selectedBooking.status)} alt={selectedBooking.status} className="w-4 h-4 mr-2 inline" />
                          {selectedBooking.status === 'canceled_by_owner' ? 'Canceled by Owner' :
                           selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status-Specific Notices */}
                {selectedBooking.status === 'pending' && (
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <span className='text-2xl'>⏳</span>
                      <div>
                        <h4 className='text-lg font-semibold text-yellow-800 mb-2'>Awaiting Owner Confirmation</h4>
                        <p className='text-yellow-700 mb-3'>
                          This booking request has been submitted and is currently pending approval from the car owner.
                          The owner will review your booking details and confirm availability.
                        </p>
                        <div className='text-sm text-yellow-600 space-y-1'>
                          <p>• <span className='font-medium'>Expected Response:</span> Within 24 hours</p>
                          <p>• <span className='font-medium'>Booking Date:</span> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <span className='text-2xl'>✅</span>
                      <div>
                        <h4 className='text-lg font-semibold text-green-800 mb-2'>Booking Confirmed!</h4>
                        <p className='text-green-700 mb-3'>
                          Great news! Your booking has been confirmed by the car owner.
                          You can now proceed with your rental as planned.
                        </p>
                        <div className='text-sm text-green-600 space-y-1'>
                          <p>• <span className='font-medium'>Confirmation Date:</span> {new Date(selectedBooking.updatedAt || selectedBooking.createdAt).toLocaleDateString()}</p>
                          <p>• <span className='font-medium'>Next Steps:</span> Contact the owner for pickup details</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.status === 'cancelled' && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <span className='text-2xl'>❌</span>
                      <div>
                        <h4 className='text-lg font-semibold text-red-800 mb-2'>Booking Cancelled</h4>
                        <p className='text-red-700 mb-3'>
                          This booking has been cancelled. If you need to make a new booking,
                          feel free to browse our available cars.
                        </p>
                        <div className='text-sm text-red-600 space-y-1'>
                          <p>• <span className='font-medium'>Cancellation Date:</span> {new Date(selectedBooking.updatedAt || selectedBooking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBooking.status === 'canceled_by_owner' && (
                  <div className='bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-start space-x-3'>
                      <span className='text-2xl'>💸</span>
                      <div>
                        <h4 className='text-lg font-semibold text-orange-800 mb-2'>Booking Canceled by Owner</h4>
                        <p className='text-orange-700 mb-3'>
                          This booking was canceled by the car owner. Your payment has been refunded to your original payment method.
                        </p>
                        <div className='text-sm text-orange-600 space-y-1'>
                          <p>• <span className='font-medium'>Refund Amount:</span> {formatCurrency(selectedBooking.refundAmount || selectedBooking.price)}</p>
                          <p>• <span className='font-medium'>Refund Status:</span> {selectedBooking.refundStatus === 'processed' ? 'Processed' : 'Pending'}</p>
                          <p>• <span className='font-medium'>Cancellation Date:</span> {new Date(selectedBooking.canceledAt || selectedBooking.updatedAt || selectedBooking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className='mt-3 p-3 bg-orange-100 rounded-lg'>
                          <p className='text-sm text-orange-800 font-medium'>💡 Need a car? Browse our available vehicles to make a new booking.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex justify-end space-x-4'>
                  <button
                    onClick={closeBookingDetails}
                    className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium'
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      closeBookingDetails();
                      navigate('/cars');
                    }}
                    className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                  >
                    Book Another Car
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
