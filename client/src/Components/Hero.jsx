import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!pickupLocation || !pickupDate || !returnDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();

    if (pickup < today.setHours(0, 0, 0, 0)) {
      alert('Pickup date cannot be in the past');
      return;
    }

    if (returnD <= pickup) {
      alert('Return date must be after pickup date');
      return;
    }

    // Navigate to cars page with search parameters
    const searchParams = new URLSearchParams({
      location: pickupLocation,
      pickupDate: pickupDate,
      returnDate: returnDate
    });

    navigate(`/cars?${searchParams.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-center relative overflow-hidden'>

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400 rounded-full blur-3xl'></div>
      </div>

      {/* Trust Indicators */}
      <div className='flex flex-wrap justify-center gap-8 mb-4 text-white/80 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
          <span>24/7 Support</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
          <span>Free Cancellation</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
          <span>Best Price Guarantee</span>
        </div>
      </div>

      <div className='z-10 max-w-4xl mx-auto px-4'>
        <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up hover-scale'>
          Luxury Cars On <span className='text-yellow-400 animate-pulse-slow'>Rent</span>
        </h1>
        <p className='text-xl md:text-2xl text-white/90 mb-12 animate-fade-in-up animation-delay-200 transition-smooth'>
          Experience the freedom of the road with City Drive's premium fleet of luxury vehicles
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col md:flex-row items-center justify-center p-6 md:p-8 rounded-2xl md:rounded-full w-full max-w-5xl bg-white/95 shadow-2xl mx-auto border border-white/20 backdrop-blur-lg animate-fade-in-up animation-delay-400'>
        <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full'>
          {/* Pickup Location */}
          <div className='flex flex-col items-start gap-2 flex-1 min-w-0'>
            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <span className='text-lg'>📍</span>
              Pickup Location
            </label>
            <select
              required
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          {/* Pickup Date */}
          <div className='flex flex-col items-start gap-2 flex-1 min-w-0'>
            <label htmlFor='pickup-date' className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <span className='text-lg'>📅</span>
              Pick-up Date
            </label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              required
            />
          </div>
          {/* Return Date */}
          <div className='flex flex-col items-start gap-2 flex-1 min-w-0'>
            <label htmlFor='return-date' className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
              <span className='text-lg'>📅</span>
              Return Date
            </label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              required
            />
          </div>
          {/* Search Button */}
          <div className='flex justify-center md:justify-end flex-1 md:flex-none'>
            <button type="submit" className='flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all font-bold font-[Montserrat] transform hover:scale-105'>
              <span className='text-lg'>🔍</span>
              Search Cars
            </button>
          </div>
        </div>
      </form>

      {/* Car Image with Stats */}
      <div className='relative z-10 mt-8'>
        <img
          src={assets.main_car}
          alt="luxury car"
          loading="lazy"
          className='max-h-80 md:max-h-96 mx-auto drop-shadow-2xl animate-fade-in-up animation-delay-600'
        />

        {/* Floating Stats */}
        <div className='absolute -top-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-in animation-delay-800'>
          <div className='text-2xl font-bold text-blue-600'>50+</div>
          <div className='text-sm text-gray-600'>Car Available</div>
        </div>

        <div className='absolute -top-8 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-in animation-delay-1000'>
          <div className='text-2xl font-bold text-green-600'>5K+</div>
          <div className='text-sm text-gray-600'>Happy Customer</div>
        </div>

        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-in animation-delay-1200'>
          <div className='text-2xl font-bold text-purple-600'>4.9★</div>
          <div className='text-sm text-gray-600'>Average Rating</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;