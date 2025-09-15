import React from 'react';
import { assets } from '../assets/assets';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Car',
      description: 'Browse our extensive fleet of luxury vehicles and select the perfect car for your needs.',
      icon: assets.search_icon
    },
    {
      step: '02',
      title: 'Book Online',
      description: 'Complete your booking in minutes with our secure online reservation system.',
      icon: assets.check_icon
    },
    {
      step: '03',
      title: 'Pickup & Drive',
      description: 'Pick up your car from our convenient locations or enjoy home delivery service.',
      icon: assets.car_icon
    },
    {
      step: '04',
      title: 'Enjoy Your Ride',
      description: 'Experience the freedom of the road with our premium vehicles and 24/7 support.',
      icon: assets.star_icon
    }
  ];

  return (
    <div className='py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-white'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            How It <span className='text-blue-600'>Works</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Renting a luxury car has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='text-center group animate-fade-in-up' style={{ animationDelay: `${index * 300}ms` }}>
              {/* Step Number */}
              <div className='relative mb-8'>
                <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 animate-bounce-in'>
                  <span className='text-2xl font-bold text-white group-hover:animate-pulse'>{step.step}</span>
                </div>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className='hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2 animate-shimmer'></div>
                )}
              </div>

              {/* Icon */}
              <div className='w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 group-hover:rotate-12 transition-all duration-500 hover-glow'>
                <img src={step.icon} alt={step.title} className='w-8 h-8 group-hover:animate-pulse' />
              </div>

              {/* Content */}
              <h3 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300'>{step.title}</h3>
              <p className='text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300'>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16'>
          <p className='text-lg text-gray-600 mb-6'>Ready to experience the difference?</p>
          <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105'>
            Start Your Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;