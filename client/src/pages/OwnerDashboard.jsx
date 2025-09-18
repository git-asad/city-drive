import React, { useState, useEffect } from 'react';
import { dummyDashboardData, assets, ownerMenuLinks, dummyUserData, dummyCarData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [editingCar, setEditingCar] = useState(null);
  const [editedCar, setEditedCar] = useState({});

  // Clear customer bookings on component mount
  useEffect(() => {
    localStorage.removeItem('customerBookings');
  }, []);

  // Calculate dynamic total cars (dummy data + added cars from localStorage)
  const getTotalCars = () => {
    const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
    return dummyCarData.length + addedCars.length;
  };

  // Get all cars (dummy data + added cars) for management
  const getAllCars = () => {
    const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
    const dummyVisibility = JSON.parse(localStorage.getItem('dummyCarVisibility') || '{}');

    // Add visibility status to dummy cars
    const dummyCarsWithVisibility = dummyCarData.map(car => ({
      ...car,
      isVisible: dummyVisibility[car._id] !== false // Default to true if not set
    }));

    return [...dummyCarsWithVisibility, ...addedCars];
  };

  // Get only visible cars for featured section
  const getFeaturedCars = () => {
    const allCars = getAllCars();
    return allCars.filter(car => car.isVisible !== false).slice(0, 4);
  };

  // Calculate dynamic statistics
  const getMonthlyRevenue = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    // Calculate revenue from actual bookings
    const totalRevenue = customerBookings.reduce((sum, booking) => sum + booking.price, 0);
    return totalRevenue;
  };

  const getTotalBookings = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    return customerBookings.length;
  };

  const getPendingBookings = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    return customerBookings.filter(booking => booking.status === 'pending').length;
  };

  const getConfirmedBookings = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    return customerBookings.filter(booking => booking.status === 'confirmed').length;
  };

  const featuredCars = getFeaturedCars();

  const handleEditCar = (car) => {
    setEditingCar(car._id);
    setEditedCar({ ...car });
  };

  const handleSaveCar = () => {
    try {
      // Check if this is an added car (from localStorage)
      const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
      const carIndex = addedCars.findIndex(car => car._id === editedCar._id);

      if (carIndex !== -1) {
        // Update the car in localStorage
        addedCars[carIndex] = { ...addedCars[carIndex], ...editedCar };
        localStorage.setItem('addedCars', JSON.stringify(addedCars));
        console.log('Updated car in localStorage:', editedCar);
      } else {
        // For dummy cars, we could implement similar logic if needed
        console.log('Updated dummy car (not persisted):', editedCar);
      }

      alert('Car details updated successfully!');
      setEditingCar(null);
      setEditedCar({});

      // Force a re-render by updating the featured cars
      // This will refresh the display with updated data
      window.location.reload();

    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car details. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
    setEditedCar({});
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        // Check if this is an added car (from localStorage)
        const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
        const updatedAddedCars = addedCars.filter(car => car._id !== carId);

        if (updatedAddedCars.length !== addedCars.length) {
          // This was an added car, remove from localStorage
          localStorage.setItem('addedCars', JSON.stringify(updatedAddedCars));
          alert('Car deleted successfully!');
          window.location.reload(); // Refresh to show updated data
        } else {
          // This is a dummy car, we can't delete it from the original data
          alert('Cannot delete original cars. You can only delete cars you added.');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car. Please try again.');
      }
    }
  };

  const toggleCarVisibility = (carId) => {
    try {
      // Check if this is an added car (from localStorage)
      const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
      const carIndex = addedCars.findIndex(car => car._id === carId);

      if (carIndex !== -1) {
        // Update the added car in localStorage
        addedCars[carIndex].isVisible = !addedCars[carIndex].isVisible;
        localStorage.setItem('addedCars', JSON.stringify(addedCars));
        alert(`Car is now ${addedCars[carIndex].isVisible ? 'visible' : 'hidden'} to customers!`);
        window.location.reload(); // Refresh to show updated data
      } else {
        // For dummy cars, store visibility status separately
        const dummyVisibility = JSON.parse(localStorage.getItem('dummyCarVisibility') || '{}');
        const currentVisibility = dummyVisibility[carId] !== false; // Default to true if not set
        dummyVisibility[carId] = !currentVisibility;
        localStorage.setItem('dummyCarVisibility', JSON.stringify(dummyVisibility));
        alert(`Car is now ${dummyVisibility[carId] ? 'visible' : 'hidden'} to customers!`);
        window.location.reload(); // Refresh to show updated data
      }
    } catch (error) {
      console.error('Error toggling car visibility:', error);
      alert('Failed to update car visibility. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedCar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const acceptBooking = (bookingId) => {
    try {
      const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
      const updatedBookings = customerBookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      );
      localStorage.setItem('customerBookings', JSON.stringify(updatedBookings));
      alert('Booking accepted successfully!');
      window.location.reload(); // Refresh to show updated status
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking. Please try again.');
    }
  };

  const rejectBooking = (bookingId) => {
    try {
      const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
      const updatedBookings = customerBookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      localStorage.setItem('customerBookings', JSON.stringify(updatedBookings));
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
      value: getTotalCars(),
      icon: assets.carIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Bookings',
      value: getTotalBookings(),
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

          {/* Monthly Revenue */}
          <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>Monthly Revenue</h2>
                <p className='text-green-100'>Current month earnings</p>
              </div>
              <div className='text-right'>
                <div className='text-4xl font-bold'>{formatCurrency(getMonthlyRevenue())}</div>
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
                const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
                const recentBookings = customerBookings.slice(-5).reverse(); // Get last 5 bookings, most recent first

                if (recentBookings.length === 0) {
                  return (
                    <div className='p-6 text-center text-gray-500'>
                      No bookings yet
                    </div>
                  );
                }

                return recentBookings.map((booking, index) => {
                  // Find the car in our combined data (dummy + added cars)
                  const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
                  const dummyCarUpdates = JSON.parse(localStorage.getItem('dummyCarUpdates') || '{}');

                  // Apply updates to dummy cars
                  const dummyCarsWithUpdates = dummyCarData.map(car => ({
                    ...car,
                    ...dummyCarUpdates[car._id]
                  }));

                  const allCars = [...dummyCarsWithUpdates, ...addedCars];
                  const carData = allCars.find(car => car._id === booking.car._id) || booking.car;

                  return (
                    <div key={booking._id || index} className='p-6 hover:bg-gray-50 transition-colors'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <img
                            src={carData.image}
                            alt={carData.brand}
                            className='w-16 h-16 rounded-lg object-cover'
                          />
                          <div>
                            <h4 className='font-semibold text-gray-900'>
                              {carData.brand} {carData.model}
                            </h4>
                            <p className='text-gray-600 text-sm'>
                              {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                            </p>
                            <p className='text-gray-500 text-sm'>{booking.pickupLocation || carData.location}</p>
                            {booking.customerInfo && (
                              <p className='text-gray-500 text-xs mt-1'>
                                Customer: {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className='text-right flex flex-col items-end gap-2'>
                          <div className='font-bold text-gray-900'>{formatCurrency(booking.price)}</div>
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
                                onClick={() => acceptBooking(booking._id)}
                                className='px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors'
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => rejectBooking(booking._id)}
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