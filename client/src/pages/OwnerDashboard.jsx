import React, { useState, useEffect } from 'react';
import { assets, ownerMenuLinks } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { bookingServices, carServices, revenueServices } from '../services/firebaseServices';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data from Firebase
        console.log('📊 Loading dashboard data for owner...');
        const [allBookings, ownerCars, revenue] = await Promise.all([
          bookingServices.getAllBookings(),
          carServices.getOwnerCars(user.id),
          revenueServices.getTotalRevenue(user.id)
        ]);

        // Filter bookings to only show those for owner's cars
        const ownerBookings = allBookings.filter(booking =>
          ownerCars.some(car => car.id === booking.carId)
        );

        console.log(`✅ Owner loaded ${ownerBookings.length} bookings, ${ownerCars.length} cars, $${revenue} revenue`);
        setBookings(ownerBookings);
        setCars(ownerCars);
        setTotalRevenue(revenue);

      } catch (err) {
        console.error('❌ Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page or contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending').length;
  };

  const getConfirmedBookings = () => {
    return bookings.filter(booking => booking.status === 'confirmed').length;
  };

  const featuredCars = cars.slice(0, 4);


  const acceptBooking = async (bookingId) => {
    try {
      // Use Firebase booking service
      await bookingServices.updateBookingStatus(bookingId, 'confirmed', user.id);

      alert('Booking accepted successfully! Revenue has been added to your dashboard.');
      window.location.reload(); // Refresh to show updated status and revenue
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking. Please try again.');
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      // Use Firebase booking service
      await bookingServices.updateBookingStatus(bookingId, 'cancelled', user.id);

      alert('Booking rejected.');
      window.location.reload(); // Refresh to show updated status
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking. Please try again.');
    }
  };

  const stats = [
    {
      title: 'Total Cars',
      value: cars.length,
      icon: assets.carIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: assets.listIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Bookings',
      value: getPendingBookings(),
      icon: assets.calendar_icon_colored,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Confirmed Bookings',
      value: getConfirmedBookings(),
      icon: assets.check_icon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

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

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <div className='w-64 bg-white shadow-lg'></div>
        <div className='flex-1 p-8 flex items-center justify-center'>
          <LoadingSpinner />
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
            <img src={dummyUserData.image} alt="Profile" className='w-12 h-12 rounded-full' />
            <div>
              <h3 className='font-semibold text-gray-900'>{dummyUserData.name}</h3>
              <p className='text-sm text-gray-500'>{dummyUserData.email}</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className='space-y-2'>
            {ownerMenuLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(link.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    link.path === '/owner'
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={link.path === '/owner' ? link.coloredIcon : link.icon}
                    alt={link.name}
                    className='w-5 h-5'
                  />
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
    <div className='flex-1 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
          <p className='text-gray-600'>Welcome back! Here's what's happening with your cars.</p>
        </div>

          {/* Total Revenue */}
          <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>Total Revenue</h2>
                <p className='text-green-100'>All-time earnings from confirmed bookings</p>
              </div>
              <div className='text-right'>
                <div className='text-4xl font-bold'>{formatCurrency(totalRevenue)}</div>
                <div className='text-green-100 text-sm'>+12% from last month</div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div key={index} className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <img src={stat.icon} alt={stat.title} className='w-6 h-6' />
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-gray-600 text-sm font-medium'>{stat.title}</p>
                    <p className='text-3xl font-bold text-gray-900 mt-1'>{stat.value}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-xl font-bold text-gray-900'>Recent Bookings</h3>
              <p className='text-gray-600 text-sm mt-1'>Latest booking activities</p>
            </div>

            <div className='divide-y divide-gray-200'>
              {(() => {
                const recentBookings = bookings.slice(-5).reverse(); // Get last 5 bookings, most recent first

                if (recentBookings.length === 0) {
                  return (
                    <div className='p-6 text-center text-gray-500'>
                      No bookings yet
                    </div>
                  );
                }

                return recentBookings.map((booking, index) => {
                  const carData = cars.find(car => car.id === booking.carId) || {};

                  return (
                    <div key={booking.id || index} className='p-6 hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <img
                            src={carData.images?.[0] || carData.imageURL || carData.image || assets.main_car}
                            alt={carData.brand || carData.name || 'Car'}
                            className='w-16 h-16 rounded-lg object-cover'
                          />
                          <div>
                            <h4 className='font-semibold text-gray-900'>
                              {carData.brand || carData.name || 'Car'} {carData.model || ''}
                            </h4>
                            <p className='text-gray-600 text-sm'>
                              {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                            </p>
                            <p className='text-gray-500 text-sm'>{carData.location || 'Location not specified'}</p>
                            <p className='text-gray-500 text-xs mt-1'>
                              Customer: {booking.customerName || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className='text-right flex flex-col items-end gap-2'>
                          <div className='font-bold text-gray-900'>{formatCurrency(booking.totalPrice)}</div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>

                          {booking.status === 'pending' && (
                            <div className='flex gap-2'>
                              <button
                                onClick={() => acceptBooking(booking.id)}
                                className='px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors'
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => rejectBooking(booking.id)}
                                className='px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors'
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className='p-6 bg-gray-50'>
              <button
                onClick={() => navigate('/owner/manage-bookings')}
                className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'
              >
                View All Bookings
              </button>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;