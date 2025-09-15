import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-center items-center justify-between px-8 md:px-14 py-12 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 max-w-7xl mx-3 md:mx-auto rounded-3xl overflow-hidden shadow-2xl relative animate-fade-in-up hover-glow'>

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-10 right-10 w-20 h-20 bg-white rounded-full blur-xl'></div>
        <div className='absolute bottom-10 left-10 w-16 h-16 bg-blue-400 rounded-full blur-xl'></div>
      </div>

      <div className='text-white z-10 md:w-1/2'>
        <h2 className='text-4xl md:text-5xl font-bold mb-4'>Do You Own a Luxury Car?</h2>
        <p className='text-xl mb-4'>Monetize your vehicle effortlessly by listing it on City Drive.</p>
        <p className='text-lg opacity-90 mb-8 max-w-lg'>We take care of insurance, driver verification and secure payments - so you can earn passive income, stress-free.</p>

        <button className='px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all text-gray-900 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105'>
          List your car
        </button>
      </div>

      <div className='z-10 md:w-1/2 mt-8 md:mt-0'>
        <img src={assets.banner_car_image} alt="luxury car" className='max-h-64 md:max-h-80 mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'/>
      </div>
    </div>
  );
}

export default Banner;


