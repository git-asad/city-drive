import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const WhyChooseUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: assets.car_icon,
      title: 'Premium Fleet',
      description: 'Choose from our extensive collection of luxury and premium vehicles for every occasion.'
    },
    {
      icon: assets.location_icon,
      title: 'Flexible Pickup',
      description: 'Convenient pickup and drop-off locations across major cities with home delivery available.'
    },
    {
      icon: assets.check_icon,
      title: 'Best Price Guarantee',
      description: 'We offer competitive rates with no hidden fees and the best price guarantee in the industry.'
    },
    {
      icon: assets.users_icon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to ensure your journey is smooth and worry-free.'
    },
    {
      icon: assets.fuel_icon,
      title: 'Full Insurance',
      description: 'Comprehensive insurance coverage for peace of mind during your rental period.'
    },
    {
      icon: assets.star_icon,
      title: 'Top Rated Service',
      description: 'Consistently rated 4.9 stars by thousands of satisfied customers worldwide.'
    }
  ];

  return (
    <div className='py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-50 to-white'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Why Choose <span className='text-blue-600'>City Drive</span>?
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group bg-white p-8 rounded-2xl shadow-lg hover-lift border border-gray-100 animate-fade-in-up'
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-bounce-in'>
                <img src={feature.icon} alt={feature.title} className='w-8 h-8 filter brightness-0 invert group-hover:animate-pulse' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300'>{feature.title}</h3>
              <p className='text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300'>{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WhyChooseUs;