import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { carAPI } from '../utils/api'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

const CarDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [car, setCar] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      const fetchCarDetails = async () => {
        try {
          setLoading(true)
          setError(null)

          const response = await carAPI.getById(id)
          setCar(response.car)
          setReviews(response.reviews || [])
        } catch (err) {
          console.error('Error fetching car details:', err)
          setError(err.message || 'Failed to load car details')
        } finally {
          setLoading(false)
        }
      }

      if (id) {
        fetchCarDetails()
      }
    }, [id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
          <div className='text-red-600 mb-4'>
            <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>Error Loading Car</h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => navigate('/cars')}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold'
          >
            Browse All Cars
          </button>
        </div>
      </div>
    )
  }

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1'>
          <img src={car.images?.[0] || car.image || assets.car_image1} alt={`${car.brand} ${car.model}`} className='w-full h-96 object-cover rounded-lg'/>
        </div>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-4'>{car.brand} {car.model} ({car.year})</h1>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div>
              <p className='text-gray-600'>Category</p>
              <p className='font-semibold'>{car.category}</p>
            </div>
            <div>
              <p className='text-gray-600'>Seating Capacity</p>
              <p className='font-semibold'>{car.seating_capacity} seats</p>
            </div>
            <div>
              <p className='text-gray-600'>Fuel Type</p>
              <p className='font-semibold'>{car.fuel_type}</p>
            </div>
            <div>
              <p className='text-gray-600'>Transmission</p>
              <p className='font-semibold'>{car.transmission}</p>
            </div>
            <div>
              <p className='text-gray-600'>Price per Day</p>
              <p className='font-semibold'>${car.pricePerDay}</p>
            </div>
            <div>
              <p className='text-gray-600'>Location</p>
              <p className='font-semibold'>{car.location}</p>
            </div>
          </div>
          <div className='mb-6'>
            <p className='text-gray-600 mb-2'>Description</p>
            <p>{car.description}</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated()) {
                // Redirect to login with booking URL as return URL
                navigate('/login', {
                  state: {
                    from: `/booking/${car._id}`,
                    message: 'You must sign in before booking a car.'
                  },
                  replace: true
                });
              } else {
                navigate(`/booking/${car._id}`);
              }
            }}
            className='bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all'
          >
            {isAuthenticated() ? 'Book Now' : 'Sign In to Book'}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
      <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
        <div className='text-red-600 mb-4'>
          <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
          </svg>
        </div>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>Car Not Found</h2>
        <p className='text-gray-600 mb-6'>The car you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/cars')}
          className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold'
        >
          Browse All Cars
        </button>
      </div>
    </div>
  )
}

export default CarDetails
