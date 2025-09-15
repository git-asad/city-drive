import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden shadow-xl'>

      <div className='text-white'>
        <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
        <p className='mt-2'>Monetize your vehicle effortlessly by listing it on
          City Drive.</p>
          <p className='max-w-[32rem]'>We take care of insurance, driver verification
            and secure payments - so you can earn passive income, stress-free.</p>

            <button className='px-6 py-2 bg-yellow-400 hover:bg-yellow-500 transition-all text-gray-900 rounded-lg text-sm mt-4 cursor-pointer shadow-md font-bold font-[Montserrat]'>List your car</button>
       </div>

       <img src={assets.banner_car_image} alt="car" className='max-h-45 mt-10'/>
    </div>
  );
}

export default Banner;