import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const AddCar = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    year: '',
    category: '',
    seating_capacity: '',
    fuel_type: '',
    transmission: '',
    pricePerDay: '',
    location: '',
    description: '',
    image: null,
    isVisible: true // New field for car visibility
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Generate a unique ID for the new car
      const newCarId = `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare the car data with proper formatting
      const newCar = {
        _id: newCarId,
        owner: "67fe3467ed8a8fe17d0ba6e2", // Using the same owner ID as existing cars
        brand: carData.brand,
        model: carData.model,
        image: imagePreview || carData.image, // Use uploaded image or fallback
        year: parseInt(carData.year),
        category: carData.category,
        seating_capacity: parseInt(carData.seating_capacity),
        fuel_type: carData.fuel_type,
        transmission: carData.transmission,
        pricePerDay: parseFloat(carData.pricePerDay),
        location: carData.location,
        description: carData.description,
        isAvaliable: true, // New cars are available by default
        isVisible: carData.isVisible, // Visibility status
        createdAt: new Date().toISOString()
      };

      // Get existing cars from localStorage or use dummy data
      const existingCars = JSON.parse(localStorage.getItem('addedCars') || '[]');

      // Add the new car to the array
      const updatedCars = [...existingCars, newCar];

      // Save to localStorage
      localStorage.setItem('addedCars', JSON.stringify(updatedCars));

      console.log('Car added successfully:', newCar);
      alert('Car added successfully! It will now appear in your Manage Cars section.');

      // Reset form
      setCarData({
        brand: '',
        model: '',
        year: '',
        category: '',
        seating_capacity: '',
        fuel_type: '',
        transmission: '',
        pricePerDay: '',
        location: '',
        description: '',
        image: null,
        isVisible: true
      });
      setImagePreview(null);

      // Navigate to manage cars
      navigate('/owner/manage-cars');

    } catch (error) {
      console.error('Error adding car:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <img src={assets.user_profile} alt="Profile" className='w-12 h-12 rounded-full' />
            <div>
              <h3 className='font-semibold text-gray-900'>GreatStack</h3>
              <p className='text-sm text-gray-500'>admin@example.com</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <button
                onClick={() => navigate('/owner')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.dashboardIcon} alt="Dashboard" className='w-5 h-5' />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/add-car')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              >
                <img src={assets.addIconColored} alt="Add Car" className='w-5 h-5' />
                Add car
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-cars')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.carIcon} alt="Manage Cars" className='w-5 h-5' />
                Manage Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-bookings')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.listIcon} alt="Manage Bookings" className='w-5 h-5' />
                Manage Bookings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Add New Car</h1>
            <p className='text-gray-600'>Fill in the details to add a new car to your fleet.</p>
          </div>

          {/* Form */}
          <div className='bg-white rounded-2xl shadow-lg p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Image Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Car Image
                </label>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                    id='car-image'
                  />
                  <label htmlFor='car-image' className='cursor-pointer'>
                    {imagePreview ? (
                      <img src={imagePreview} alt='Preview' className='max-h-48 mx-auto rounded-lg' />
                    ) : (
                      <div className='text-gray-500'>
                        <img src={assets.upload_icon} alt='Upload' className='w-12 h-12 mx-auto mb-2' />
                        <p>Click to upload car image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Brand
                  </label>
                  <input
                    type='text'
                    name='brand'
                    value={carData.brand}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Model
                  </label>
                  <input
                    type='text'
                    name='model'
                    value={carData.model}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Year
                  </label>
                  <input
                    type='number'
                    name='year'
                    value={carData.year}
                    onChange={handleInputChange}
                    min='2000'
                    max={new Date().getFullYear() + 1}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <select
                    name='category'
                    value={carData.category}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select Category</option>
                    <option value='SUV'>SUV</option>
                    <option value='Sedan'>Sedan</option>
                    <option value='Hatchback'>Hatchback</option>
                    <option value='Coupe'>Coupe</option>
                    <option value='Convertible'>Convertible</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Seating Capacity
                  </label>
                  <input
                    type='number'
                    name='seating_capacity'
                    value={carData.seating_capacity}
                    onChange={handleInputChange}
                    min='1'
                    max='9'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Fuel Type
                  </label>
                  <select
                    name='fuel_type'
                    value={carData.fuel_type}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select Fuel Type</option>
                    <option value='Petrol'>Petrol</option>
                    <option value='Diesel'>Diesel</option>
                    <option value='Hybrid'>Hybrid</option>
                    <option value='Electric'>Electric</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Transmission
                  </label>
                  <select
                    name='transmission'
                    value={carData.transmission}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select Transmission</option>
                    <option value='Manual'>Manual</option>
                    <option value='Automatic'>Automatic</option>
                    <option value='Semi-Automatic'>Semi-Automatic</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Price per Day ($)
                  </label>
                  <input
                    type='number'
                    name='pricePerDay'
                    value={carData.pricePerDay}
                    onChange={handleInputChange}
                    min='1'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Location
                  </label>
                  <select
                    name='location'
                    value={carData.location}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select Location</option>
                    <option value='New York'>New York</option>
                    <option value='Los Angeles'>Los Angeles</option>
                    <option value='Chicago'>Chicago</option>
                    <option value='Houston'>Houston</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={carData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Describe the car features, condition, etc.'
                  required
                />
              </div>

              {/* Submit Button */}
              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  onClick={() => navigate('/owner')}
                  className='px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Add Car
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;