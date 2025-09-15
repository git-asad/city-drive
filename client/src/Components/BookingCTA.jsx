import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const BookingCTA = () => {
  const navigate = useNavigate();

  return (
    <div className='py-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-r from-blue-600 to-purple-600'>
      <div className='max-w-4xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
          Ready to Experience the Difference?
        </h2>
        <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
          Start your booking journey today and discover why thousands of customers choose City Drive for their luxury car rental needs.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button
            onClick={() => {
              navigate('/cars');
              window.scrollTo(0, 0);
            }}
            className='bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer flex items-center gap-3'
          >
            <img src={assets.car_icon} alt="" className='w-6 h-6' />
            Start Your Booking
          </button>

          <button
            onClick={() => {
              navigate('/my-bookings');
              window.scrollTo(0, 0);
            }}
            className='border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all cursor-pointer'
          >
            View My Bookings
          </button>
        </div>

        <div className='mt-8 flex flex-wrap justify-center gap-6 text-white/80'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <span>Free Cancellation</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <span>24/7 Support</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <span>Best Price Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCTA;