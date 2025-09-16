import React from 'react'
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 border-t border-transparent shadow-inner font-[Montserrat]'>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8'>
                {/* About Section */}
                <div>
                    <img src={assets.logo} alt="City Drive logo" className='h-8 md:h-9 mb-4' />
                    <p className='max-w-80 text-gray-100 leading-relaxed'>
                      Premium City Drive service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                      <a href="#" className='hover:opacity-80 transition-opacity'><img src={assets.facebook_logo} className='w-5 h-5' alt="Facebook" /></a>
                      <a href="#" className='hover:opacity-80 transition-opacity'><img src={assets.instagram_logo} className='w-5 h-5' alt="Instagram" /></a>
                      <a href="#" className='hover:opacity-80 transition-opacity'><img src={assets.twitter_logo} className='w-5 h-5' alt="Twitter" /></a>
                      <a href="#" className='hover:opacity-80 transition-opacity'><img src={assets.gmail_logo} className='w-5 h-5' alt="Email" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className='text-lg font-semibold text-white uppercase mb-4'>Quick Links</h2>
                    <ul className='space-y-2'>
                        <li><Link to="/" className='text-gray-100 hover:text-white transition-colors'>Home</Link></li>
                        <li><Link to="/cars" className='text-gray-100 hover:text-white transition-colors'>Browse Cars</Link></li>
                        <li><Link to="/my-bookings" className='text-gray-100 hover:text-white transition-colors'>My Bookings</Link></li>
                        <li><Link to="/about" className='text-gray-100 hover:text-white transition-colors'>About Us</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h2 className='text-lg font-semibold text-white uppercase mb-4'>Services</h2>
                    <ul className='space-y-2'>
                        <li><Link to="/cars" className='text-gray-100 hover:text-white transition-colors'>Car Rental</Link></li>
                        <li><a href="#" className='text-gray-100 hover:text-white transition-colors'>Luxury Fleet</a></li>
                        <li><a href="#" className='text-gray-100 hover:text-white transition-colors'>Airport Transfer</a></li>
                        <li><a href="#" className='text-gray-100 hover:text-white transition-colors'>Chauffeur Service</a></li>
                    </ul>
                </div>

                {/* Support & Contact */}
                <div>
                    <h2 className='text-lg font-semibold text-white uppercase mb-4'>Support</h2>
                    <ul className='space-y-2'>
                        <li><Link to="/contact" className='text-gray-100 hover:text-white transition-colors'>Contact Us</Link></li>
                        <li><Link to="/contact" className='text-gray-100 hover:text-white transition-colors'>Help Center</Link></li>
                        <li><Link to="/terms" className='text-gray-100 hover:text-white transition-colors'>Terms of Service</Link></li>
                        <li><Link to="/privacy" className='text-gray-100 hover:text-white transition-colors'>Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} City Drive. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><Link to="/privacy" className='hover:text-blue-600 transition-colors'>Privacy</Link><span> | </span></li>
                    <li><Link to="/terms" className='hover:text-blue-600 transition-colors'>Terms</Link><span> | </span></li>
                    <li><a href="#" className='hover:text-blue-600 transition-colors'>Sitemap</a></li>
                </ul>
            </div>
        </div>
  )
}

export default Footer
