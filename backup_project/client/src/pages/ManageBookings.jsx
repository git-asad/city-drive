import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyMyBookingsData, assets } from '../assets/assets';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(dummyMyBookingsData);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const matchesSearch = !searchTerm ||
      booking.car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking._id === bookingId ? { ...booking, status: newStatus } : booking
    ));
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Manage Bookings</h1>
            <p className='text-gray-600'>View and manage all car rental bookings.</p>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Search by car brand or model...'
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
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className='space-y-6'>
            {filteredBookings.map((booking) => (
              <div key={booking._id} className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
                <div className='flex flex-col lg:flex-row gap-6'>
                  {/* Car Image */}
                  <div className='lg:w-48'>
                    <img
                      src={booking.car.image}
                      alt={`${booking.car.brand} ${booking.car.model}`}
                      className='w-full h-32 object-cover rounded-xl'
                    />
                  </div>

                  {/* Booking Details */}
                  <div className='flex-1'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-gray-900 mb-1'>
                          {booking.car.brand} {booking.car.model}
                        </h3>
                        <p className='text-gray-600'>{booking.car.location}</p>
                      </div>
                      <div className='mt-2 md:mt-0'>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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

                    <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between'>
                      <div className='text-sm text-gray-600'>
                        <span className='font-medium'>Booked by:</span> User ID: {booking.user}
                      </div>

                      {/* Status Actions */}
                      <div className='flex gap-2'>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking._id, 'confirmed')}
                              className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, 'cancelled')}
                              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className='text-center py-12'>
              <img src={assets.listIcon} alt="No bookings" className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <h3 className='text-xl font-medium text-gray-900 mb-2'>No bookings found</h3>
              <p className='text-gray-600'>Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Summary Stats */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>{bookings.length}</div>
              <div className='text-gray-600'>Total Bookings</div>
            </div>
            <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-yellow-600 mb-2'>
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className='text-gray-600'>Pending</div>
            </div>
            <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className='text-gray-600'>Confirmed</div>
            </div>
            <div className='bg-white rounded-2xl shadow-lg p-6 text-center'>
              <div className='text-3xl font-bold text-red-600 mb-2'>
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className='text-gray-600'>Cancelled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;