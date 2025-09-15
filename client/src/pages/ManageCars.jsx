import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyCarData, assets } from '../assets/assets';

const ManageCars = () => {
  const navigate = useNavigate();

  // Load cars from localStorage and combine with dummy data
  const loadCars = () => {
    const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
    const dummyVisibility = JSON.parse(localStorage.getItem('dummyCarVisibility') || '{}');
    const dummyCarUpdates = JSON.parse(localStorage.getItem('dummyCarUpdates') || '{}');
    const deletedDummyCars = JSON.parse(localStorage.getItem('deletedDummyCars') || '[]');

    // Filter out deleted dummy cars and add visibility status and updates
    const dummyCarsWithVisibility = dummyCarData
      .filter(car => !deletedDummyCars.includes(car._id)) // Exclude deleted cars
      .map(car => ({
        ...car,
        ...dummyCarUpdates[car._id], // Apply any updates
        isVisible: dummyVisibility[car._id] !== false // Respect stored visibility, default true
      }));

    // Ensure added cars respect their visibility
    const addedCarsWithVisibility = addedCars.map(car => ({
      ...car,
      isVisible: car.isVisible !== false // Default to true if not set
    }));

    return [...dummyCarsWithVisibility, ...addedCarsWithVisibility];
  };

  const [cars, setCars] = useState(loadCars);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState({
    pricePerDay: '',
    location: '',
    seating_capacity: '',
    fuel_type: ''
  });

  useEffect(() => {
    setCars(loadCars());
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || car.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      // Update local state
      setCars(cars.filter(car => car._id !== carId));

      // If this is an added car, also remove from localStorage
      const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
      const updatedAddedCars = addedCars.filter(car => car._id !== carId);

      if (updatedAddedCars.length !== addedCars.length) {
        localStorage.setItem('addedCars', JSON.stringify(updatedAddedCars));
      } else {
        // For dummy cars, track as deleted in localStorage
        const deletedDummyCars = JSON.parse(localStorage.getItem('deletedDummyCars') || '[]');
        if (!deletedDummyCars.includes(carId)) {
          deletedDummyCars.push(carId);
          localStorage.setItem('deletedDummyCars', JSON.stringify(deletedDummyCars));
        }
      }

      alert('Car deleted successfully!');
    }
  };

  const toggleAvailability = (carId) => {
    // Update local state
    const updatedCars = cars.map(car =>
      car._id === carId ? { ...car, isAvaliable: !car.isAvaliable } : car
    );
    setCars(updatedCars);

    // If this is an added car, also update localStorage
    const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
    const carIndex = addedCars.findIndex(car => car._id === carId);

    if (carIndex !== -1) {
      addedCars[carIndex].isAvaliable = !addedCars[carIndex].isAvaliable;
      localStorage.setItem('addedCars', JSON.stringify(addedCars));
    }
  };

  const toggleCarVisibility = (carId) => {
    try {
      // Update local state
      const updatedCars = cars.map(car =>
        car._id === carId ? { ...car, isVisible: !car.isVisible } : car
      );
      setCars(updatedCars);

      // Check if this is an added car (from localStorage)
      const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
      const carIndex = addedCars.findIndex(car => car._id === carId);

      if (carIndex !== -1) {
        // Update the added car in localStorage
        addedCars[carIndex].isVisible = !addedCars[carIndex].isVisible;
        localStorage.setItem('addedCars', JSON.stringify(addedCars));
        alert(`Car is now ${addedCars[carIndex].isVisible ? 'visible' : 'hidden'} to customers!`);
      } else {
        // For dummy cars, store visibility status separately
        const dummyVisibility = JSON.parse(localStorage.getItem('dummyCarVisibility') || '{}');
        const currentVisibility = dummyVisibility[carId] !== false; // Default to true if not set
        dummyVisibility[carId] = !currentVisibility;
        localStorage.setItem('dummyCarVisibility', JSON.stringify(dummyVisibility));
        alert(`Car is now ${dummyVisibility[carId] ? 'visible' : 'hidden'} to customers!`);
      }
    } catch (error) {
      console.error('Error toggling car visibility:', error);
      alert('Failed to update car visibility. Please try again.');
    }
  };

  const startEditing = (car) => {
    setEditingCar(car._id);
    setEditForm({
      pricePerDay: car.pricePerDay,
      location: car.location,
      seating_capacity: car.seating_capacity,
      fuel_type: car.fuel_type
    });
  };

  const cancelEditing = () => {
    setEditingCar(null);
    setEditForm({
      pricePerDay: '',
      location: '',
      seating_capacity: '',
      fuel_type: ''
    });
  };

  const saveCarChanges = async (carId) => {
    try {
      // Ensure data is properly formatted
      const updatedForm = {
        ...editForm,
        pricePerDay: parseFloat(editForm.pricePerDay) || 0,
        seating_capacity: parseInt(editForm.seating_capacity) || 0
      };

      console.log('Saving car data locally:', updatedForm); // Debug log

      // Update local state
      const updatedCars = cars.map(car =>
        car._id === carId ? { ...car, ...updatedForm } : car
      );
      setCars(updatedCars);

      // Check if this is an added car (from localStorage)
      const addedCars = JSON.parse(localStorage.getItem('addedCars') || '[]');
      const carIndex = addedCars.findIndex(car => car._id === carId);

      if (carIndex !== -1) {
        // Update the added car in localStorage
        addedCars[carIndex] = { ...addedCars[carIndex], ...updatedForm };
        localStorage.setItem('addedCars', JSON.stringify(addedCars));
      } else {
        // For dummy cars, store updated data separately
        const dummyCarUpdates = JSON.parse(localStorage.getItem('dummyCarUpdates') || '{}');
        dummyCarUpdates[carId] = updatedForm;
        localStorage.setItem('dummyCarUpdates', JSON.stringify(dummyCarUpdates));
      }

      // Reset editing state
      setEditingCar(null);
      setEditForm({
        pricePerDay: '',
        location: '',
        seating_capacity: '',
        fuel_type: ''
      });

      alert('Car details updated successfully!');

    } catch (error) {
      console.error('Error updating car locally:', error);
      alert('Failed to update car details. Please try again.');
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
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
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.addIcon} alt="Add Car" className='w-5 h-5' />
                Add car
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-cars')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              >
                <img src={assets.carIconColored} alt="Manage Cars" className='w-5 h-5' />
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
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-end mb-4'>
              <button
                onClick={() => navigate('/owner/add-car')}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
              >
                <img src={assets.addIcon} alt="Add" className='w-5 h-5' />
                Add New Car
              </button>
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Manage Cars</h1>
            <p className='text-gray-600'>Manage your car fleet and availability.</p>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Search by brand or model...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <div className='md:w-48'>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All Locations</option>
                  <option value='New York'>New York</option>
                  <option value='Los Angeles'>Los Angeles</option>
                  <option value='Chicago'>Chicago</option>
                  <option value='Houston'>Houston</option>
                </select>
              </div>
            </div>
          </div>


          {/* Manage Featured Cars Section */}
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden mt-8'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-xl font-bold text-gray-900'>Manage Featured Cars</h3>
              <p className='text-gray-600 text-sm mt-1'>Edit properties of cars displayed in the featured section</p>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {cars.map((car) => (
                  <div key={car._id} className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-start gap-4 mb-4'>
                      <div className='relative'>
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className='w-20 h-20 object-cover rounded-lg'
                        />
                        {/* Visibility Status Badge */}
                        <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          car.isVisible !== false ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <span className='text-white font-bold'>
                            {car.isVisible !== false ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-900'>
                          {editingCar === car._id ? (
                            <div className='flex gap-4'>
                              <div className='flex-1'>
                                <label className='block text-xs font-medium text-gray-700 mb-1'>Brand</label>
                                <input
                                  type='text'
                                  value={editForm.brand || car.brand}
                                  onChange={(e) => handleEditFormChange('brand', e.target.value)}
                                  className='w-full border px-2 py-1 rounded text-sm'
                                  placeholder='Brand'
                                />
                              </div>
                              <div className='flex-1'>
                                <label className='block text-xs font-medium text-gray-700 mb-1'>Model</label>
                                <input
                                  type='text'
                                  value={editForm.model || car.model}
                                  onChange={(e) => handleEditFormChange('model', e.target.value)}
                                  className='w-full border px-2 py-1 rounded text-sm'
                                  placeholder='Model'
                                />
                              </div>
                            </div>
                          ) : (
                            `${car.brand} ${car.model}`
                          )}
                        </h4>
                        {editingCar === car._id ? (
                          <div className='mt-3'>
                            <label className='block text-xs font-medium text-gray-700 mb-1'>Year</label>
                            <input
                              type='number'
                              value={editForm.year || car.year}
                              onChange={(e) => handleEditFormChange('year', e.target.value)}
                              className='border px-2 py-1 rounded text-sm w-24'
                              placeholder='Year'
                            />
                          </div>
                        ) : (
                          <p className='text-sm text-gray-600 mt-1'>{car.year}</p>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>Price/Day</label>
                        {editingCar === car._id ? (
                          <input
                            type='number'
                            value={editForm.pricePerDay || car.pricePerDay}
                            onChange={(e) => handleEditFormChange('pricePerDay', e.target.value)}
                            className='w-full border px-2 py-1 rounded text-sm'
                            placeholder='Price'
                          />
                        ) : (
                          <p className='text-sm font-medium'>${car.pricePerDay}</p>
                        )}
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>Location</label>
                        {editingCar === car._id ? (
                          <select
                            value={editForm.location || car.location}
                            onChange={(e) => handleEditFormChange('location', e.target.value)}
                            className='w-full border px-2 py-1 rounded text-sm'
                          >
                            <option value=''>Select Location</option>
                            <option value='New York'>New York</option>
                            <option value='Los Angeles'>Los Angeles</option>
                            <option value='Chicago'>Chicago</option>
                            <option value='Houston'>Houston</option>
                          </select>
                        ) : (
                          <p className='text-sm'>{car.location}</p>
                        )}
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>Seats</label>
                        {editingCar === car._id ? (
                          <input
                            type='number'
                            value={editForm.seating_capacity || car.seating_capacity}
                            onChange={(e) => handleEditFormChange('seating_capacity', e.target.value)}
                            className='w-full border px-2 py-1 rounded text-sm'
                            placeholder='Seats'
                          />
                        ) : (
                          <p className='text-sm'>{car.seating_capacity} seats</p>
                        )}
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>Fuel Type</label>
                        {editingCar === car._id ? (
                          <select
                            value={editForm.fuel_type || car.fuel_type}
                            onChange={(e) => handleEditFormChange('fuel_type', e.target.value)}
                            className='w-full border px-2 py-1 rounded text-sm'
                          >
                            <option value=''>Select Fuel</option>
                            <option value='Petrol'>Petrol</option>
                            <option value='Diesel'>Diesel</option>
                            <option value='Hybrid'>Hybrid</option>
                            <option value='Electric'>Electric</option>
                          </select>
                        ) : (
                          <p className='text-sm'>{car.fuel_type}</p>
                        )}
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      {editingCar === car._id ? (
                        <>
                          <button
                            onClick={() => saveCarChanges(car._id)}
                            className='flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors'
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className='flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors'
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(car)}
                            className='flex-1 bg-blue-600 text-white px-2 py-2 rounded text-sm hover:bg-blue-700 transition-colors'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleCarVisibility(car._id)}
                            className={`flex-1 py-2 px-2 rounded text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                              car.isVisible !== false
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            title={car.isVisible !== false ? 'Hide from customers' : 'Show to customers'}
                          >
                            {car.isVisible !== false ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className='bg-red-600 text-white py-2 px-2 rounded text-sm font-medium hover:bg-red-700 transition-colors'
                            title='Delete car'
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCars;