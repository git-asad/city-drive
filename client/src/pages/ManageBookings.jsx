import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { bookingServices, carServices } from '../services/firebaseServices';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const ManageBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all bookings and owner's cars from Firebase
        console.log('📊 Loading bookings and cars for owner dashboard...');
        const [allBookings, ownerCars] = await Promise.all([
          bookingServices.getAllBookings(),
          carServices.getOwnerCars(user.id)
        ]);

        // Filter bookings to only show those for owner's cars
        const ownerBookings = allBookings.filter(booking =>
          ownerCars.some(car => car.id === booking.carId)
        );

        console.log(`✅ Owner loaded ${ownerBookings.length} bookings for ${ownerCars.length} cars`);
        setBookings(ownerBookings);
        setCars(ownerCars);

      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError('Failed to load bookings. Please refresh the page or contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user]);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const car = cars.find(c => c.id === booking.carId);
    const matchesSearch = !searchTerm ||
      car?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log(`🔄 Owner updating booking ${bookingId} to status: ${newStatus}`);

      // Get current booking to check if it's being canceled
      const currentBooking = bookings.find(booking => booking.id === bookingId);

      // Use Firebase booking service
      await bookingServices.updateBookingStatus(bookingId, newStatus, user.id);

      // Handle owner cancellation logic
      if (newStatus === 'cancelled' && currentBooking?.status === 'confirmed') {
        // Owner is canceling an approved booking - this would trigger refund logic
        console.log(`💸 Processing owner cancellation refund for booking ${bookingId}`);
        alert('✅ Booking cancelled successfully! Refund has been processed.');
      } else if (newStatus === 'confirmed') {
        alert('✅ Booking confirmed successfully! Revenue has been added to your dashboard.');
      } else {
        const statusMessage = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        alert(`✅ Booking ${statusMessage} successfully!`);
      }

      // Reload bookings to reflect the change
      const updatedBookings = await bookingServices.getAllBookings();
      const ownerBookings = updatedBookings.filter(booking =>
        cars.some(car => car.id === booking.carId)
      );
      setBookings(ownerBookings);

      console.log(`✅ Owner successfully updated booking ${bookingId} to ${newStatus}`);

    } catch (err) {
      console.error('❌ Error in owner status update:', err);
      alert('❌ Failed to update booking status. Please try again or contact support.');

      // Reload bookings to ensure UI consistency
      try {
        const refreshedBookings = await bookingServices.getAllBookings();
        const ownerBookings = refreshedBookings.filter(booking =>
          cars.some(car => car.id === booking.carId)
        );
        setBookings(ownerBookings);
      } catch (reloadError) {
        console.error('❌ Error reloading bookings after failed update:', reloadError);
      }
    }
  };

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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'canceled_by_owner':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <div className='w-64 bg-white shadow-lg'></div>
        <div className='flex-1 p-8 flex items-center justify-center'>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <div className='w-64 bg-white shadow-lg'></div>
        <div className='flex-1 p-8 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-xl font-bold text-red-600 mb-2'>Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <img src={assets.user_profile} alt="Profile" className='w-12 h-12 rounded-full' />
            <div>
              <h3 className='font-semibold text-gray-900'>GreatStack</h3>
              <p className='text-sm text-gray-500'>admin@example.com</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <button
                onClick={() => navigate('/owner')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.dashboardIcon} alt="Dashboard" className='w-5 h-5' />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/add-car')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.addIcon} alt="Add Car" className='w-5 h-5' />
                Add car
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-cars')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.carIcon} alt="Manage Cars" className='w-5 h-5' />
                Manage Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-bookings')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              >
                <img src={assets.listIconColored} alt="Manage Bookings" className='w-5 h-5' />
                Manage Bookings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Client Booking Requests</h1>
                <p className='text-gray-600'>Review and manage incoming car rental booking requests from customers.</p>
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <div className='mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800'>
                    <span className='w-2 h-2 bg-yellow-400 rounded-full mr-2'></span>
                    {bookings.filter(b => b.status === 'pending').length} pending requests
                  </div>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Actions for Pending Requests */}
          {bookings.filter(b => b.status === 'pending').length > 0 && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center'>
                    <span className='text-yellow-600 text-lg'>⚡</span>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-yellow-800'>Pending Booking Requests</h3>
                    <p className='text-yellow-700 text-sm'>You have {bookings.filter(b => b.status === 'pending').length} booking requests waiting for your approval</p>
                  </div>
                </div>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className='px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium'
                >
                  View Pending
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Search by car brand, model, or customer email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <div className='md:w-48'>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All Statuses</option>
                  <option value='pending'>⏳ Pending Requests</option>
                  <option value='confirmed'>✅ Confirmed</option>
                  <option value='cancelled'>❌ Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className='space-y-6'>
            {filteredBookings.length === 0 ? (
              <div className='text-center py-12 bg-white rounded-2xl'>
                <img src={assets.listIcon} alt="No bookings" className='w-16 h-16 mx-auto mb-4 opacity-50' />
                <h3 className='text-xl font-medium text-gray-900 mb-2'>No bookings found</h3>
                <p className='text-gray-600'>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const car = cars.find(c => c.id === booking.carId) || {};
                return (
                  <div key={booking.id} className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${booking.status === 'pending' ? 'ring-2 ring-yellow-300 bg-yellow-50/30' : ''}`}>
                    <div className='flex flex-col lg:flex-row gap-6'>
                      {/* Car Image */}
                      <div className='lg:w-48'>
                        <img
                          src={car.images?.[0] || car.imageURL || car.image || assets.main_car}
                          alt={`${car.brand || car.name || 'Car'} ${car.model || ''}`}
                          loading="lazy"
                          className='w-full h-32 object-cover rounded-xl'
                        />
                        {booking.status === 'pending' && (
                          <div className='mt-2 text-center'>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                              <span className='w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1 animate-pulse'></span>
                              Awaiting Confirmation
                            </span>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className='mt-2 text-center'>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                              <span className='w-1.5 h-1.5 bg-green-400 rounded-full mr-1'></span>
                              Confirmed
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className='flex-1'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
                          <div>
                            <h3 className='text-xl font-bold text-gray-900 mb-1'>
                              {car.brand || car.name || 'Car'} {car.model || ''}
                            </h3>
                            <p className='text-gray-600'>{car.location || 'Location not specified'}</p>
                          </div>
                          <div className='mt-2 md:mt-0'>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status === 'canceled_by_owner' ? 'Canceled by Owner' :
                               booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                          <div>
                            <p className='text-sm text-gray-600'>Pickup Date</p>
                            <p className='font-medium'>{formatDate(booking.pickupDate)}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Return Date</p>
                            <p className='font-medium'>{formatDate(booking.returnDate)}</p>
                          </div>
                          <div>
                            <p className='text-sm text-gray-600'>Total Amount</p>
                            <p className='font-bold text-blue-600'>{formatCurrency(booking.totalPrice)}</p>
                          </div>
                        </div>

                        {/* Customer Information */}
                        <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                          <h4 className='text-sm font-semibold text-gray-900 mb-2'>Customer Details</h4>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                              <span className='font-medium text-gray-700'>Name:</span>
                              <span className='ml-2 text-gray-600'>{booking.customerName || 'N/A'}</span>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>Email:</span>
                              <span className='ml-2 text-gray-600'>{booking.customerEmail || 'N/A'}</span>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>Phone:</span>
                              <span className='ml-2 text-gray-600'>{booking.customerPhone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>License:</span>
                              <span className='ml-2 text-gray-600'>Not provided</span>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between'>
                          <div className='text-sm text-gray-600'>
                            <span className='font-medium'>Booking ID:</span> {booking.id}
                            <span className='ml-4 font-medium'>Created:</span> {new Date(booking.createdAt?.toDate?.() || booking.createdAt).toLocaleDateString()}
                          </div>

                          {/* Status Actions */}
                          <div className='flex gap-2'>
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
                                >
                                  ✅ Approve Request
                                </button>
                                <button
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
                                >
                                  ❌ Reject Request
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
                              >
                                Cancel Booking
                              </button>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className='px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium'>
                                Request Cancelled
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>



          {/* Summary Stats */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
            {(() => {
              const totalBookings = bookings.length;
              const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
              const pendingBookings = bookings.filter(b => b.status === 'pending').length;
              const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
              const totalRevenue = bookings
                .filter(b => b.status === 'confirmed')
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

              return (
                <>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      {confirmedBookings}
                    </div>
                    <div className='text-gray-600'>Total Confirmed Bookings</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-green-600 mb-2'>${totalRevenue.toFixed(2)}</div>
                    <div className='text-gray-600'>Total Revenue</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>{pendingBookings}</div>
                    <div className='text-gray-600'>Pending Approval</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-red-600 mb-2'>{cancelledBookings}</div>
                    <div className='text-gray-600'>Cancelled</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;