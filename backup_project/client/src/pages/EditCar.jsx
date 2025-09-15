import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyCarData, assets } from '../assets/assets';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [editedCar, setEditedCar] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCar = dummyCarData.find(car => car._id === id);
      if (foundCar) {
        setCar(foundCar);
        setEditedCar({ ...foundCar });
      }
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setEditedCar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically send the updated car data to your backend
      console.log('Saving car:', editedCar);
      alert('Car details updated successfully!');
      navigate('/owner');
    } catch (error) {
      alert('Error updating car details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner');
  };

  if (!car) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading car details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Edit Car Details</h1>
              <p className='text-gray-600 mt-1'>Update information for {car.brand} {car.model}</p>
            </div>
            <button
              onClick={handleCancel}
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>

          {/* Car Image Section */}
          <div className='p-8 border-b border-gray-200'>
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='flex-shrink-0'>
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className='w-64 h-48 object-cover rounded-xl shadow-lg'
                />
              </div>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Car Information</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                    <input
                      type='text'
                      value={editedCar.brand || ''}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Model</label>
                    <input
                      type='text'
                      value={editedCar.model || ''}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Year</label>
                    <input
                      type='number'
                      value={editedCar.year || ''}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                    <select
                      value={editedCar.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value=''>Select Category</option>
                      <option value='SUV'>SUV</option>
                      <option value='Sedan'>Sedan</option>
                      <option value='Hatchback'>Hatchback</option>
                      <option value='Coupe'>Coupe</option>
                      <option value='Convertible'>Convertible</option>
                      <option value='Wagon'>Wagon</option>
                      <option value='Pickup'>Pickup</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className='p-8 border-b border-gray-200'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Pricing & Location</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Price per Day ($)</label>
                <input
                  type='number'
                  value={editedCar.pricePerDay || ''}
                  onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  min='0'
                  step='0.01'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
                <select
                  value={editedCar.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Select Location</option>
                  <option value='New York'>New York</option>
                  <option value='Los Angeles'>Los Angeles</option>
                  <option value='Chicago'>Chicago</option>
                  <option value='Houston'>Houston</option>
                  <option value='Miami'>Miami</option>
                  <option value='Seattle'>Seattle</option>
                  <option value='Boston'>Boston</option>
                  <option value='San Francisco'>San Francisco</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className='p-8 border-b border-gray-200'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Technical Specifications</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Seating Capacity</label>
                <input
                  type='number'
                  value={editedCar.seating_capacity || ''}
                  onChange={(e) => handleInputChange('seating_capacity', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  min='1'
                  max='20'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Fuel Type</label>
                <select
                  value={editedCar.fuel_type || ''}
                  onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Select Fuel Type</option>
                  <option value='Petrol'>Petrol</option>
                  <option value='Diesel'>Diesel</option>
                  <option value='Hybrid'>Hybrid</option>
                  <option value='Electric'>Electric</option>
                  <option value='CNG'>CNG</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Transmission</label>
                <select
                  value={editedCar.transmission || ''}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Select Transmission</option>
                  <option value='Manual'>Manual</option>
                  <option value='Automatic'>Automatic</option>
                  <option value='Semi-Automatic'>Semi-Automatic</option>
                  <option value='CVT'>CVT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='p-8 border-b border-gray-200'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Description</h3>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Car Description</label>
              <textarea
                value={editedCar.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter a detailed description of the car...'
              />
            </div>
          </div>

          {/* Availability */}
          <div className='p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Availability</h3>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='isAvailable'
                checked={editedCar.isAvaliable || false}
                onChange={(e) => handleInputChange('isAvaliable', e.target.checked)}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='isAvailable' className='ml-2 block text-sm text-gray-900'>
                Car is available for booking
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='px-8 pb-8 flex gap-4'>
            <button
              onClick={handleSave}
              disabled={loading}
              className='flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className='flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCar;