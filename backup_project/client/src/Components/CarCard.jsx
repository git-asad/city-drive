import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {

     const currency = import.meta.env.VITE_CURRENCY || '$'
     const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); window.scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover-lift cursor-pointer transition-smooth'>
      
      <div className="relative w-full h-60">
        <img
          src={car.image}
          alt="Car Image"
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />

        {car.isAvaliable && (
          <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>
            Available Now
          </p>
        )}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
          <div className='text-center'>
            <div className='text-sm text-white/80'>Daily Rate</div>
            <span className='font-semibold text-lg' >{currency}{car.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
          </div>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
        <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
            <span>{car.seating_capacity} Seats</span>
        </div>
        <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
            <span>{car.fuel_type}</span>
        </div>
        <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
            <span>{car.transmission}</span>
        </div>
        <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
            <span>{car.location}</span>
        </div>
        </div>

        {/* Security Deposit */}
        <div className='mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img src={assets.tick_icon} alt="Security" className='w-4 h-4 text-blue-600'/>
              <span className='text-sm font-medium text-blue-900'>Security Deposit</span>
            </div>
            <span className='text-sm font-semibold text-blue-600'>{currency}{Math.min(car.pricePerDay * 0.5, 500)}</span>
          </div>
          <p className='text-xs text-blue-700 mt-1'>Fully refundable upon return</p>
        </div>

      </div>

    </div>
  );
};

export default CarCard;