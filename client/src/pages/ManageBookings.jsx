import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { loadAllBookings, updateBookingStatus, getStorageStats, getDashboardStats } from '../utils/bookingStorage';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use centralized booking storage utility
        console.log('📊 Loading all bookings for owner dashboard...');
        const allBookings = loadAllBookings();

        console.log(`✅ Owner loaded ${allBookings.length} total bookings`);
        setBookings(allBookings);

      } catch (err) {
        console.error('❌ Error loading bookings:', err);
        setError('Failed to load bookings. Please refresh the page or contact support.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const matchesSearch = !searchTerm ||
      booking.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log(`🔄 Owner updating booking ${bookingId} to status: ${newStatus}`);

      // Get current booking to check if it's being canceled
      const allBookings = loadAllBookings();
      const currentBooking = allBookings.find(booking => booking._id === bookingId);

      // Use centralized booking storage utility
      const result = updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        // Handle owner cancellation logic
        if (newStatus === 'cancelled' && currentBooking?.status === 'confirmed') {
          // Owner is canceling an approved booking
          console.log(`💸 Processing owner cancellation refund for booking ${bookingId}`);

          // Prepare cancellation details
          const cancellationDetails = {
            canceledBy: 'owner',
            canceledAt: new Date().toISOString(),
            refundAmount: currentBooking.paymentInfo?.amount || currentBooking.price,
            refundStatus: 'processed'
          };

          // Update the booking with cancellation details
          const cancelResult = updateBookingStatus(bookingId, 'canceled_by_owner', cancellationDetails);
          if (cancelResult.success) {
            console.log(`✅ Owner cancellation processed with refund: $${updatedBooking.refundAmount}`);

            // Decrease total bookings counter for owner cancellations
            const currentTotal = parseInt(localStorage.getItem('totalBookingsCounter') || '2');
            if (currentTotal > 0) {
              const newTotal = currentTotal - 1;
              localStorage.setItem('totalBookingsCounter', newTotal.toString());
              console.log(`📊 Total bookings counter decreased: ${currentTotal} → ${newTotal} (owner cancellation)`);
            }
          }
        }

        // Reload all bookings to reflect the change
        const updatedBookings = loadAllBookings();
        setBookings(updatedBookings);

        const statusMessage = newStatus === 'canceled_by_owner' ? 'Canceled by Owner' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        console.log(`✅ Owner successfully updated booking ${bookingId} to ${newStatus}`);
        alert(`✅ Booking ${statusMessage} successfully!${newStatus === 'canceled_by_owner' ? ' Refund has been processed.' : ''}`);
      } else {
        console.error('❌ Status update failed:', result.message);
        alert(`❌ Failed to update booking status: ${result.message}`);
      }

    } catch (err) {
      console.error('❌ Error in owner status update:', err);
      alert('❌ Failed to update booking status. Please try again or contact support.');

      // Reload bookings to ensure UI consistency
      try {
        const refreshedBookings = loadAllBookings();
        setBookings(refreshedBookings);
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
              filteredBookings.map((booking) => (
                <div key={booking._id} className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${booking.status === 'pending' ? 'ring-2 ring-yellow-300 bg-yellow-50/30' : ''}`}>
                <div className='flex flex-col lg:flex-row gap-6'>
                  {/* Car Image */}
                  <div className='lg:w-48'>
                    <img
                      src={booking.car?.image || assets.main_car}
                      alt={`${booking.car?.brand || 'Car'} ${booking.car?.model || ''}`}
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
                          {booking.car?.brand || 'Car'} {booking.car?.model || ''}
                        </h3>
                        <p className='text-gray-600'>{booking.car?.location || 'Location not specified'}</p>
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
                        <p className='font-bold text-blue-600'>{formatCurrency(booking.price)}</p>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                      <h4 className='text-sm font-semibold text-gray-900 mb-2'>Customer Details</h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='font-medium text-gray-700'>Name:</span>
                          <span className='ml-2 text-gray-600'>{booking.customerInfo?.firstName} {booking.customerInfo?.lastName}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Email:</span>
                          <span className='ml-2 text-gray-600'>{booking.customerInfo?.email}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>Phone:</span>
                          <span className='ml-2 text-gray-600'>{booking.customerInfo?.phone}</span>
                        </div>
                        <div>
                          <span className='font-medium text-gray-700'>License:</span>
                          <span className='ml-2 text-gray-600'>{booking.customerInfo?.licenseNumber || 'Not provided'}</span>
                        </div>
                      </div>
                      {booking.specialRequests && (
                        <div className='mt-3'>
                          <span className='font-medium text-gray-700'>Special Requests:</span>
                          <p className='mt-1 text-gray-600 text-sm bg-white p-2 rounded border'>{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between'>
                      <div className='text-sm text-gray-600'>
                        <span className='font-medium'>Booking ID:</span> {booking._id}
                        <span className='ml-4 font-medium'>Created:</span> {new Date(booking.createdAt).toLocaleDateString()}
                        {booking.status === 'canceled_by_owner' && booking.refundAmount && (
                          <span className='ml-4'>
                            <span className='font-medium text-orange-600'>Refunded:</span>
                            <span className='text-orange-600'> ${booking.refundAmount}</span>
                          </span>
                        )}
                      </div>

                      {/* Status Actions */}
                      <div className='flex gap-2'>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking._id, 'confirmed')}
                              className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
                            >
                              ✅ Approve Request
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, 'cancelled')}
                              className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
                            >
                              ❌ Reject Request
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
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
            ))
            )}
          </div>



          {/* Summary Stats */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
            {(() => {
              const stats = getDashboardStats();
              return (
                <>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-blue-600 mb-2'>
                      {parseInt(localStorage.getItem('totalBookingsCounter') || '2')}
                    </div>
                    <div className='text-gray-600'>Total Confirmed Bookings</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-green-600 mb-2'>${stats.totalRevenue.toFixed(2)}</div>
                    <div className='text-gray-600'>Total Revenue</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-yellow-600 mb-2'>{stats.pendingBookings}</div>
                    <div className='text-gray-600'>Pending Approval</div>
                  </div>
                  <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
                    <div className='text-3xl font-bold text-red-600 mb-2'>{stats.cancelledBookings}</div>
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