import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { carAPI, bookingAPI, getAuthToken } from '../utils/api';
import PaymentStep from '../Components/PaymentStep';
import LoadingSpinner from '../Components/LoadingSpinner';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    licenseNumber: '',
    specialRequests: '',
    insurance: false
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await carAPI.getById(id);
        setSelectedCar(response.car);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalDays = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;
    const pickup = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    const diffTime = Math.abs(returnDate - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    const basePrice = days * (selectedCar?.pricePerDay || 0);
    const insurance = bookingData.insurance ? days * 15 : 0;
    const subtotal = basePrice + insurance;
    const tax = subtotal * 0.08;
    const deposit = Math.min(selectedCar?.pricePerDay * 0.5, 500);
    return Math.round((subtotal + tax + deposit) * 100) / 100;
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'pickupDate', 'returnDate', 'pickupLocation'
    ];

    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    const cleanPhone = bookingData.phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 7) {
      alert('Please enter a valid phone number');
      return;
    }

    // Validate dates
    const pickupDate = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      alert('Pickup date cannot be in the past');
      return;
    }

    if (returnDate <= pickupDate) {
      alert('Return date must be after pickup date');
      return;
    }

    try {
      // Create payment intent first
      const paymentData = {
        carId: selectedCar._id,
        pickupDate: bookingData.pickupDate,
        returnDate: bookingData.returnDate,
        insurance: bookingData.insurance,
        email: bookingData.email
      };

      const paymentResponse = await bookingAPI.create(paymentData);

      // Navigate to payment step with the payment intent
      setCurrentStep(4);

      // The PaymentStep component will handle the actual booking creation
      // after successful payment

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Car Details', description: 'Review selected car' },
    { number: 2, title: 'Booking Info', description: 'Select dates & location' },
    { number: 3, title: 'Personal Info', description: 'Enter your details' },
    { number: 4, title: 'Payment', description: 'Secure payment' },
    { number: 5, title: 'Confirmation', description: 'Review & confirm' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center'>
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
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with Back Button */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Main Content */}
            <div className='flex-1'>
              {/* Progress Steps */}
              <div className='mb-8'>
                <div className='flex items-center justify-between'>
                  {steps.map((step, index) => (
                    <div key={step.number} className='flex items-center'>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step.number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.number}
                      </div>
                      <div className='ml-4'>
                        <h3 className={`font-medium ${
                          currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </h3>
                        <p className='text-sm text-gray-500'>{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className='bg-white rounded-2xl shadow-lg p-8'>

                {/* Step 1: Car Details */}
                {currentStep === 1 && selectedCar && (
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Selected Car</h2>
                    <div className='flex flex-col md:flex-row gap-8'>
                      <img
                        src={selectedCar.images?.[0] || selectedCar.image || assets.car_image1}
                        alt={selectedCar.brand}
                        className='w-full md:w-96 h-64 object-cover rounded-xl'
                      />
                      <div className='flex-1'>
                        <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                          {selectedCar.brand} {selectedCar.model}
                        </h3>
                        <div className='grid grid-cols-2 gap-4 mb-6'>
                          <div className='flex items-center gap-2'>
                            <img src={assets.users_icon} alt="" className='w-5 h-5'/>
                            <span>{selectedCar.seating_capacity} Seats</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <img src={assets.fuel_icon} alt="" className='w-5 h-5'/>
                            <span>{selectedCar.fuel_type}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <img src={assets.car_icon} alt="" className='w-5 h-5'/>
                            <span>{selectedCar.transmission}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <img src={assets.location_icon} alt="" className='w-5 h-5'/>
                            <span>{selectedCar.location}</span>
                          </div>
                        </div>
                        <div className='text-2xl font-bold text-blue-600 mb-4'>
                          ${selectedCar.pricePerDay}/day
                        </div>
                        <p className='text-gray-600'>{selectedCar.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Booking Information */}
                {currentStep === 2 && selectedCar && (
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Booking Information</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Pickup Location
                        </label>
                        <select
                          name='pickupLocation'
                          value={bookingData.pickupLocation}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        >
                          <option value="">Select Location</option>
                          <option value="New York">New York</option>
                          <option value="Los Angeles">Los Angeles</option>
                          <option value="Chicago">Chicago</option>
                          <option value="Houston">Houston</option>
                        </select>
                      </div>
                      <div></div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Pickup Date
                        </label>
                        <input
                          type='date'
                          name='pickupDate'
                          value={bookingData.pickupDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Return Date
                        </label>
                        <input
                          type='date'
                          name='returnDate'
                          value={bookingData.returnDate}
                          onChange={handleInputChange}
                          min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='flex items-center'>
                          <input
                            type='checkbox'
                            name='insurance'
                            checked={bookingData.insurance}
                            onChange={(e) => setBookingData(prev => ({
                              ...prev,
                              insurance: e.target.checked
                            }))}
                            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                          />
                          <span className='ml-2 text-sm text-gray-700'>
                            Add insurance ($15/day) - Covers damage, theft, and liability
                          </span>
                        </label>
                      </div>
                    </div>
                    {calculateTotalDays() > 0 && selectedCar && (
                      <div className='mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Rental Fee Breakdown</h3>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center bg-white/50 p-3 rounded-lg'>
                            <span className='text-gray-700 font-medium'>Daily Rental Rate:</span>
                            <span className='font-bold text-lg'>${selectedCar.pricePerDay}/day</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-700'>Rental Duration:</span>
                            <span className='font-medium'>{calculateTotalDays()} days</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-700'>Rental Subtotal:</span>
                            <span className='font-medium'>${(selectedCar.pricePerDay * calculateTotalDays()).toFixed(2)}</span>
                          </div>
                          {bookingData.insurance && (
                            <div className='flex justify-between items-center'>
                              <span className='text-gray-700'>Insurance (15$/day):</span>
                              <span className='font-medium'>${(15 * calculateTotalDays()).toFixed(2)}</span>
                            </div>
                          )}
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-700'>Security Deposit:</span>
                            <span className='font-medium'>${Math.min(selectedCar.pricePerDay * 0.5, 500).toFixed(2)}</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-700'>Tax (8%):</span>
                            <span className='font-medium'>${(((selectedCar.pricePerDay * calculateTotalDays()) + (bookingData.insurance ? 15 * calculateTotalDays() : 0)) * 0.08).toFixed(2)}</span>
                          </div>
                          <div className='flex justify-between items-center pt-3 border-t-2 border-blue-300 bg-blue-100/50 p-3 rounded-lg'>
                            <span className='text-lg font-bold text-gray-900'>Total Amount:</span>
                            <span className='text-xl font-bold text-blue-600'>${calculateTotalPrice()}</span>
                          </div>
                        </div>
                        <div className='mt-4 text-sm text-blue-700 bg-blue-100/50 p-3 rounded-lg'>
                          <p className='font-medium'>Security deposit is fully refundable upon vehicle return in good condition.</p>
                          {bookingData.insurance && <p className='mt-1'>Insurance covers damage, theft, and third-party liability.</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Personal Information */}
                {currentStep === 3 && (
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Personal Information</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          First Name
                        </label>
                        <input
                          type='text'
                          name='firstName'
                          value={bookingData.firstName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Last Name
                        </label>
                        <input
                          type='text'
                          name='lastName'
                          value={bookingData.lastName}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Email
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={bookingData.email}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Phone Number
                        </label>
                        <div className='flex gap-2'>
                          <select
                            name='countryCode'
                            value={bookingData.countryCode}
                            onChange={handleInputChange}
                            className='px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
                            style={{ width: '120px' }}
                          >
                            <option value="+1">🇺🇸 +1</option>
                          </select>
                          <input
                            type='tel'
                            name='phone'
                            value={bookingData.phone}
                            onChange={handleInputChange}
                            placeholder='Phone number'
                            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            required
                          />
                        </div>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Driver's License Number
                        </label>
                        <input
                          type='text'
                          name='licenseNumber'
                          value={bookingData.licenseNumber}
                          onChange={handleInputChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Special Requests (Optional)
                        </label>
                        <textarea
                          name='specialRequests'
                          value={bookingData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          placeholder='Any special requests or requirements...'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && selectedCar && (
                  <PaymentStep
                    bookingData={{
                      carId: selectedCar._id,
                      pickupDate: bookingData.pickupDate,
                      returnDate: bookingData.returnDate,
                      pickupLocation: bookingData.pickupLocation,
                      returnLocation: bookingData.pickupLocation, // Same as pickup for now
                      days: calculateTotalDays(),
                      insurance: bookingData.insurance,
                      driverInfo: {
                        firstName: bookingData.firstName,
                        lastName: bookingData.lastName,
                        email: bookingData.email,
                        phone: bookingData.countryCode + bookingData.phone.replace(/[\s\-\(\)]/g, ''),
                        licenseNumber: bookingData.licenseNumber
                      },
                      emergencyContact: {},
                      specialRequests: bookingData.specialRequests
                    }}
                    car={selectedCar}
                    onPaymentSuccess={(booking) => {
                      // Handle successful payment
                      alert('Payment successful! Booking confirmed.');
                      navigate('/my-bookings');
                    }}
                    onPaymentError={(error) => {
                      alert('Payment failed: ' + error);
                    }}
                  />
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && selectedCar && (
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Booking Confirmation</h2>

                    {/* Car Summary */}
                    <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                      <h3 className='font-bold text-lg mb-4'>Car Details</h3>
                      <div className='flex items-center gap-4 mb-4'>
                        <img src={selectedCar.images?.[0] || selectedCar.image || assets.car_image1} alt={selectedCar.brand} className='w-20 h-20 object-cover rounded-lg' />
                        <div>
                          <h4 className='font-semibold'>{selectedCar.brand} {selectedCar.model}</h4>
                          <p className='text-gray-600'>{selectedCar.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                      <h3 className='font-bold text-lg mb-4'>Booking Summary</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span>Pickup Location:</span>
                          <span className='font-medium'>{bookingData.pickupLocation}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Pickup Date:</span>
                          <span className='font-medium'>{new Date(bookingData.pickupDate).toLocaleDateString()}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Return Date:</span>
                          <span className='font-medium'>{new Date(bookingData.returnDate).toLocaleDateString()}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Duration:</span>
                          <span className='font-medium'>{calculateTotalDays()} days</span>
                        </div>
                        <div className='flex justify-between text-lg font-bold border-t pt-2'>
                          <span>Total Amount:</span>
                          <span className='text-blue-600'>${calculateTotalPrice()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information Summary */}
                    <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                      <h3 className='font-bold text-lg mb-4'>Personal Information</h3>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <span className='text-gray-600'>Name:</span>
                          <p className='font-medium'>{bookingData.firstName} {bookingData.lastName}</p>
                        </div>
                        <div>
                          <span className='text-gray-600'>Email:</span>
                          <p className='font-medium'>{bookingData.email}</p>
                        </div>
                        <div>
                          <span className='text-gray-600'>Phone:</span>
                          <p className='font-medium'>{bookingData.countryCode} {bookingData.phone}</p>
                        </div>
                        <div>
                          <span className='text-gray-600'>License:</span>
                          <p className='font-medium'>{bookingData.licenseNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className='flex justify-between mt-8'>
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className='px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
                    >
                      Previous
                    </button>
                  )}

                  {/* Invisible placeholder for Step 1 to keep Next button on the right */}
                  {currentStep === 1 && <div className='invisible'>Placeholder</div>}

                  {currentStep < 5 ? (
                    <button
                      onClick={nextStep}
                      className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className='px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold'
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

      {/* Sidebar with Car Details and Booking Info */}
      <div className='lg:w-96'>
        <div className='sticky top-8 space-y-6'>

        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default BookingPage;