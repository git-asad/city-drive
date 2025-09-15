 import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isOwner, isCustomer } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Owner navigation menu
  const ownerMenuItems = [
    { name: 'Home', path: '/home', icon: assets.dashboardIcon },
    { name: 'Cars', path: '/cars', icon: assets.carIcon },
    { name: 'Settings', path: '/settings', icon: assets.edit_icon },
    { name: 'Dashboard', path: '/dashboard', icon: assets.dashboardIconColored }
  ];

  // Customer navigation menu
  const customerMenuItems = [
    { name: 'Home', path: '/home', icon: assets.dashboardIcon },
    { name: 'Cars', path: '/cars', icon: assets.carIcon },
    { name: 'My Bookings', path: '/my-bookings', icon: assets.listIcon }
  ];

  const menuItems = isOwner() ? ownerMenuItems : customerMenuItems;

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className='bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo - Left Corner */}
          <div className='flex items-center flex-shrink-0'>
            <Link to={isAuthenticated() ? (isOwner() ? '/dashboard' : '/home') : '/login'} className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                <span className='text-white text-xl font-bold'>🗺️</span>
              </div>
              <div className='text-white'>
                <h1 className='text-lg font-bold tracking-wide'>CITY</h1>
                <p className='text-xs font-medium text-blue-200'>DRIVE</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className='hidden md:flex items-center space-x-6 flex-1 justify-center'>
            {isAuthenticated() && menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-blue-600 bg-opacity-70 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
                }`}
              >
                <span className='w-5 h-5 mr-3 flex items-center justify-center text-white text-sm'>
                  {item.name === 'Home' ? '🏠' :
                   item.name === 'Cars' ? '🚗' :
                   item.name === 'My Bookings' ? '📋' :
                   item.name === 'Profile' ? '👤' :
                   item.name === 'Dashboard' ? '📊' : '•'}
                </span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu - Right Corner */}
          <div className='hidden md:flex items-center flex-shrink-0'>
            {isAuthenticated() ? (
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white'>
                    <span className='text-white text-sm font-bold'>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className='text-left'>
                    <div className='text-sm font-semibold text-white'>{user?.name}</div>
                    <div className='text-xs text-gray-300 capitalize font-medium'>{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className='px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg'
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg'
              >
                SIGN IN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700`}>
        <div className='px-6 pt-4 pb-6 space-y-2'>
          {isAuthenticated() && menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-blue-600 bg-opacity-70 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-blue-600 hover:bg-opacity-50'
              }`}
            >
              <span className='w-6 h-6 mr-4 flex items-center justify-center text-white text-base'>
                {item.name === 'Home' ? '🏠' :
                 item.name === 'Cars' ? '🚗' :
                 item.name === 'My Bookings' ? '📋' :
                 item.name === 'Profile' ? '👤' :
                 item.name === 'Dashboard' ? '📊' : '•'}
              </span>
              {item.name}
            </Link>
          ))}

          {isAuthenticated() ? (
            <div className='border-t border-blue-400 pt-6 mt-6'>
              <div className='flex items-center px-4 py-3 mb-4'>
                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-white'>
                  <span className='text-white text-base font-bold'>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <div className='text-base font-semibold text-white'>{user?.name}</div>
                  <div className='text-sm text-gray-300 capitalize font-medium'>{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className='w-full text-left px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md'
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to='/login'
              onClick={() => setIsMenuOpen(false)}
              className='block px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md text-center'
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;