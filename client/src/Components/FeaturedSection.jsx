import React from 'react';
import Title from './Title';
import { assets, dummyCarData } from '../assets/assets';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';

const FeaturedSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-50 via-white to-gray-50'>
      <div className='text-center mb-16'>
        <Title
          title='Featured Vehicles'
          subTitle='Explore our selection of premium vehicles available for your next adventure.'
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
        {(() => {
          // Combine dummy cars with added cars and filter visible ones
          const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
          const dummyVisibility = JSON.parse(localStorage.getItem('dummyCarVisibility') || '{}');

          // Add visibility status to dummy cars
          const dummyCarsWithVisibility = dummyCarData.map(car => ({
            ...car,
            isVisible: dummyVisibility[car._id] !== false // Default to true if not set
          }));

          const allCars = [...dummyCarsWithVisibility, ...addedCars];
          const visibleCars = allCars.filter(car => car.isVisible !== false);

          return visibleCars.slice(0, 6).map((car, index) => (
            <div
              key={car._id}
              className='animate-fade-in-up hover-lift'
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CarCard car={car} />
            </div>
          ));
        })()}
      </div>
      <div className='text-center'>
        <button
          onClick={() => {
            navigate('/cars');
            window.scrollTo(0, 0);
          }}
          className='group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold'
        >
          Explore all cars
          <img
            src={assets.arrow_icon}
            alt='arrow'
            className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300'
          />
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
