import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets';

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-center'>

      <h1 className='text-4xl md:text-5xl font-semibold'>Luxury Cars On Rent</h1>

      <form className='flex flex-col md:flex-row items-center justify-center p-8 rounded-lg md:rounded-full w-full max-w-3xl bg-white/80 shadow-[0px_8px_20px_rgba(124,58,237,0.08)] mx-auto border border-white/30 backdrop-blur-md'>
        <div className='flex flex-col md:flex-row items-center gap-6 w-full'>
          {/* Pickup Location */}
          <div className='flex flex-col items-start gap-1'>
            <select
              required
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <p className='px-1 text-sm text-gray-500'>
              {pickupLocation ? pickupLocation : 'Please Select Location'}
            </p>
          </div>
          {/* Pickup Date */}
          <div className='flex flex-col items-start gap-1'>
            <label htmlFor='pickup-date'>Pick-up Date</label>
            <input
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split('T')[0]}
              className='text-sm text-grey-500'
              required
            />
          </div>
          {/* Return Date */}
          <div className='flex flex-col items-start gap-1'>
            <label htmlFor='return-date'>Return Date</label>
            <input
              type="date"
              id="return-date"
              className='text-sm text-grey-500'
              required
            />
          </div>
          {/* Search Button */}
          <div className='flex-1 flex justify-end'>
            <button type="submit" className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full cursor-pointer ml-2 mt-0 shadow-md transition-all font-bold font-[Montserrat]'>
              Search
            </button>
          </div>
        </div>
      </form>
      <img src={assets.main_car} alt="car" className='max-h-74' />
    </div>
  );
};

export default Hero;