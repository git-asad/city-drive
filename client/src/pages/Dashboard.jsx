import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assets, dummyCarData, ownerMenuLinks, dummyUserData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate basic statistics
  const getTotalCars = () => {
    const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
    return dummyCarData.length + addedCars.length;
  };

  const getTotalBookings = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    return customerBookings.length;
  };

  const getMonthlyRevenue = () => {
    const customerBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
    return customerBookings.reduce((sum, booking) => sum + booking.price, 0);
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
      title: 'Monthly Revenue',
      value: `$${getMonthlyRevenue()}`,
      icon: assets.check_icon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Car',
      description: 'List a new vehicle for rent',
      icon: assets.addIcon,
      path: '/owner/add-car',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Cars',
      description: 'Edit or remove existing cars',
      icon: assets.carIcon,
      path: '/owner/manage-cars',
      color: 'bg-green-500'
    },
    {
      title: 'View Bookings',
      description: 'Check booking requests',
      icon: assets.listIcon,
      path: '/owner/manage-bookings',
      color: 'bg-purple-500'
    },
    {
      title: 'Profile Settings',
      description: 'Update your account details',
      icon: assets.user_profile,
      path: '/profile',
      color: 'bg-orange-500'
    }
  ];

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
                    link.path === '/dashboard'
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={link.path === '/dashboard' ? link.coloredIcon : link.icon}
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
            <p className='text-gray-600'>Welcome back! Here's an overview of your car rental business.</p>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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

          {/* Quick Actions */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Quick Actions</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className='p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all text-left group'
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <img src={action.icon} alt={action.title} className='w-5 h-5' />
                  </div>
                  <h4 className='font-semibold text-gray-900 mb-1'>{action.title}</h4>
                  <p className='text-sm text-gray-600'>{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Recent Activity</h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <img src={assets.carIcon} alt="Car" className='w-5 h-5' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>Welcome to your dashboard!</p>
                  <p className='text-xs text-gray-600'>Start by adding your first car or managing existing ones.</p>
                </div>
                <span className='text-xs text-gray-500'>Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;