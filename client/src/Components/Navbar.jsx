import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const currentPath = location.pathname;

  const textColor = isHomePage ? "text-white" : "text-gray-900";
  const hoverTextColor = isHomePage ? "hover:text-yellow-200" : "hover:text-blue-600";
  const hoverBgColor = isHomePage ? "hover:bg-white/10" : "hover:bg-gray-100";


  const handleLogout = () => {
    logout();
    navigate(user?.role === 'owner' ? '/owner-login' : '/client-login');
    setOpen(false);
  };

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24
    xl:px-32 py-4 border-b border-transparent shadow-lg relative transition-all
    ${isHomePage ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400" : "bg-white"}`}>
      {/* Left side - Logo */}
      <div className="flex items-center">
        <Link to='/'>
          <img src={assets.logo} alt="logo" className="h-8 hover:drop-shadow-2xl transition-all duration-200" />
        </Link>
        <img src={assets.bmw_new} alt="" className="h-10 ml-4 hidden sm:inline drop-shadow-xl hover:drop-shadow-2xl transition-all duration-200" />
      </div>

      {/* Center - Navigation Menu */}
      <div className="hidden sm:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
        {/* Public Links */}
        <Link
          to='/'
          className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
            currentPath === '/' || currentPath === '/home'
              ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
              : `${textColor} ${hoverTextColor} ${hoverBgColor}`
          }`}
        >
          Home
        </Link>
        <Link
          to='/about'
          className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
            currentPath === '/about'
              ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
              : `${textColor} ${hoverTextColor} ${hoverBgColor}`
          }`}
        >
          About
        </Link>
        <Link
          to='/contact'
          className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
            currentPath === '/contact'
              ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
              : `${textColor} ${hoverTextColor} ${hoverBgColor}`
          }`}
        >
          Contact
        </Link>

        {/* Client Links - Only for authenticated customers */}
        {isAuthenticated() && user?.role === 'customer' && (
          <>
            <Link
              to='/cars'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/cars'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Cars
            </Link>
            <Link
              to='/my-bookings'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/my-bookings'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              My Bookings
            </Link>
            <Link
              to='/profile'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/profile'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Profile
            </Link>
          </>
        )}

        {/* Owner Links - Only for authenticated owners */}
        {isAuthenticated() && user?.role === 'owner' && (
          <>
            <Link
              to='/cars'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/cars'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Cars
            </Link>
            <Link
              to='/owner/add-car'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/owner/add-car'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Add Car
            </Link>
            <Link
              to='/owner/manage-cars'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/owner/manage-cars'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Manage Cars
            </Link>
            <Link
              to='/owner/manage-bookings'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/owner/manage-bookings'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Manage Bookings
            </Link>
            <Link
              to='/profile'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/profile'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Profile
            </Link>
            <Link
              to='/settings'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/settings'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Settings
            </Link>
            <Link
              to='/settings'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/settings'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Settings
            </Link>
          </>
        )}

        {/* Login for non-authenticated users */}
        {!isAuthenticated() && (
          <>
            <Link
              to='/client-login'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/client-login'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Client Login
            </Link>
            <Link
              to='/owner-login'
              className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/owner-login'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Owner Login
            </Link>
          </>
        )}
      </div>


      {/* Mobile Menu */}
      <div className={`sm:hidden max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col items-center gap-8 max-sm:p-4 transition-all duration-300 z-50 ${isHomePage ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400/80 backdrop-blur-md bg-opacity-80" : "bg-white/80 backdrop-blur-md"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
        <div className='flex flex-col items-center justify-center gap-8 w-full'>
          <div className='flex flex-col items-center gap-4'>
            {/* Public Links */}
            <Link
              to='/'
              onClick={() => setOpen(false)}
              className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/' || currentPath === '/home'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Home
            </Link>
            <Link
              to='/about'
              onClick={() => setOpen(false)}
              className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/about'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              About
            </Link>
            <Link
              to='/contact'
              onClick={() => setOpen(false)}
              className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                currentPath === '/contact'
                  ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                  : `${textColor} ${hoverTextColor} ${hoverBgColor}`
              }`}
            >
              Contact
            </Link>

            {/* Client Links - Only for authenticated customers */}
            {isAuthenticated() && user?.role === 'customer' && (
              <>
                <Link
                  to='/cars'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/cars'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Cars
                </Link>
                <Link
                  to='/my-bookings'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/my-bookings'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to='/profile'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/profile'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to='/settings'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/settings'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Settings
                </Link>
                <Link
                  to='/settings'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/settings'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Settings
                </Link>
              </>
            )}

            {/* Owner Links - Only for authenticated owners */}
            {isAuthenticated() && user?.role === 'owner' && (
              <>
                <Link
                  to='/cars'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/cars'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Cars
                </Link>
                <Link
                  to='/owner/add-car'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/owner/add-car'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Add Car
                </Link>
                <Link
                  to='/owner/manage-cars'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/owner/manage-cars'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Manage Cars
                </Link>
                <Link
                  to='/owner/manage-bookings'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/owner/manage-bookings'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Manage Bookings
                </Link>
                <Link
                  to='/profile'
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                    currentPath === '/profile'
                      ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                      : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {/* Login/Signup for non-authenticated users */}
            {!isAuthenticated() && (
              <>
                <Link
                  to='/client-login'
                  onClick={() => setOpen(false)}
                  className='px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-md border-2 border-yellow-500'
                >
                  Client Login
                </Link>
                <Link
                  to='/owner-login'
                  onClick={() => setOpen(false)}
                  className='px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 bg-green-400 hover:bg-green-500 text-gray-900 shadow-md border-2 border-green-500 mt-4'
                >
                  Owner Login
                </Link>
              </>
            )}
          </div>

          {/* User info and logout for authenticated users */}
          {isAuthenticated() && (
            <div className='mt-8 text-center'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-lg font-bold'>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className='text-left'>
                  <div className='text-white font-semibold'>{user?.name}</div>
                  <div className='text-gray-300 text-sm capitalize'>{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className='px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu"/>
      </button>
    </div>
  );
};

export default Navbar;