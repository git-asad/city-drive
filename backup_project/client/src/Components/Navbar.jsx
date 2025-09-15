import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isOwnerPage = location.pathname.startsWith("/owner");
  const currentPath = location.pathname;


  const textColor = isHomePage ? "text-white" : "text-gray-900";
  const hoverTextColor = isHomePage ? "hover:text-yellow-200" : "hover:text-blue-600";
  const hoverBgColor = isHomePage ? "hover:bg-white/10" : "hover:bg-gray-100";

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/cars") return "Cars";
    if (path === "/my-bookings") return "My Bookings";
    if (path === "/profile") return "Profile";
    if (path === "/login") return "Login";
    if (path.startsWith("/car-details")) return "Car Details";
    if (path.startsWith("/booking")) return "Booking";
    if (path.startsWith("/owner")) return "Dashboard";
    return "Page";
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
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`px-4 py-2 rounded-lg font-bold font-[Montserrat] text-sm tracking-wide uppercase transition-all duration-200 ${
              link.name === 'Home' && currentPath === '/'
                ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 ${
                    isHomePage ? 'border-yellow-300 bg-yellow-400/20' : 'border-blue-500 bg-blue-50'
                  } shadow-lg transform hover:scale-105`
                : link.name === 'Cars' && currentPath === '/cars'
                ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                : link.name === 'My Bookings' && currentPath === '/my-bookings'
                ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                : link.name === 'Profile' && currentPath === '/profile'
                ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                : link.name === 'Dashboard' && isOwnerPage
                ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                : link.name === 'Login' && currentPath === '/login'
                ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-md border-2 border-yellow-500'
                : `${textColor} ${hoverTextColor} ${hoverBgColor}`
            }`}
          >
            {link.name === 'Home' && (
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            {link.name}
          </Link>
        ))}
      </div>


      {/* Mobile Menu */}
      <div className={`sm:hidden max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col items-center gap-8 max-sm:p-4 transition-all duration-300 z-50 ${isHomePage ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400/80 backdrop-blur-md bg-opacity-80" : "bg-white/80 backdrop-blur-md"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
        <div className='flex flex-col items-center justify-center gap-8 w-full'>
          <div className='flex flex-col items-center gap-4'>
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`px-6 py-2 rounded-lg font-bold font-[Montserrat] text-lg text-center tracking-wide uppercase transition-all duration-200 ${
                  link.name === 'Home' && currentPath === '/'
                    ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 ${
                        isHomePage ? 'border-yellow-300 bg-yellow-400/20' : 'border-blue-500 bg-blue-50'
                      } shadow-lg transform hover:scale-105`
                    : link.name === 'Cars' && currentPath === '/cars'
                    ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                    : link.name === 'My Bookings' && currentPath === '/my-bookings'
                    ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                    : link.name === 'Profile' && currentPath === '/profile'
                    ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                    : link.name === 'Dashboard' && isOwnerPage
                    ? `${textColor} ${hoverTextColor} ${hoverBgColor} border-2 border-blue-500 bg-blue-50 shadow-lg`
                    : link.name === 'Login' && currentPath === '/login'
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-md border-2 border-yellow-500'
                    : `${textColor} ${hoverTextColor} ${hoverBgColor}`
                }`}
              >
                {link.name === 'Home' && (
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu"/>
      </button>
    </div>
  );
};

export default Navbar;