import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carServices, bookingServices } from '../services/firebaseServices';
import { assets } from '../assets/assets';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Booking Details, 2: Payment
  const [bookingSummary, setBookingSummary] = useState(null);

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
    insurance: false,
    paymentMethod: 'credit_card',
    paymentType: 'full', // 'full' or 'deposit'
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'US',
    saveCard: false,
    termsAccepted: false
  });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/client-login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load car details
  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const carData = await carServices.getCarById(id);
      setCar(carData);
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setBookingData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === 'cvv') {
      const numericValue = value.replace(/\D/g, '');
      setBookingData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    setBookingData(prev => ({ ...prev, [name]: value }));
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
    const basePrice = days * (car?.pricePerDay || 0);
    const insurance = bookingData.insurance ? days * 15 : 0;
    const subtotal = basePrice + insurance;
    const tax = subtotal * 0.08;
    const deposit = Math.min(car?.pricePerDay * 0.5, 500);
    return Math.round((subtotal + tax + deposit) * 100) / 100;
  };

  const handleBookingDetailsSubmit = (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'pickupDate', 'returnDate', 'pickupLocation'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const cleanPhone = bookingData.phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 7) {
      alert('Please enter a valid phone number');
      return;
    }

    const pickupDate = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (pickupDate < tomorrow) {
      alert('Pickup date must be at least 24 hours from now to allow time for owner confirmation');
      return;
    }

    if (returnDate <= pickupDate) {
      alert('Return date must be after pickup date');
      return;
    }

    const diffDays = Math.ceil(Math.abs(returnDate - pickupDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 1 || diffDays > 30) {
      alert('Rental period must be between 1 and 30 days');
      return;
    }

    // Create booking summary for payment step
    const summary = {
      car: {
        _id: car?._id,
        brand: car?.brand,
        model: car?.model,
        name: car?.name || `${car?.brand} ${car?.model}`,
        image: car?.images?.[0] || car?.image || assets.main_car,
        pricePerDay: car?.pricePerDay,
        location: car?.location,
        category: car?.category,
        year: car?.year
      },
      customerInfo: {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.countryCode + bookingData.phone.replace(/[\s\-()]/g, ''),
        licenseNumber: bookingData.licenseNumber
      },
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      pickupLocation: bookingData.pickupLocation,
      returnLocation: bookingData.pickupLocation,
      days: calculateTotalDays(),
      insurance: bookingData.insurance,
      specialRequests: bookingData.specialRequests,
      totalPrice: calculateTotalPrice(),
      basePrice: calculateTotalDays() * (car?.pricePerDay || 0),
      insuranceCost: bookingData.insurance ? calculateTotalDays() * 15 : 0,
      tax: (calculateTotalDays() * (car?.pricePerDay || 0) + (bookingData.insurance ? calculateTotalDays() * 15 : 0)) * 0.08,
      deposit: Math.min(car?.pricePerDay * 0.5, 500)
    };

    setBookingSummary(summary);
    setCurrentStep(2); // Move to payment step
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!bookingSummary) {
      alert('Booking summary not found. Please go back and try again.');
      return;
    }

    // Payment validation
    if (bookingData.paymentMethod === 'credit_card') {
      const requiredPaymentFields = ['cardNumber', 'expiryMonth', 'expiryYear', 'cvv', 'cardholderName'];
      const missingPaymentFields = requiredPaymentFields.filter(field => !bookingData[field]);

      if (missingPaymentFields.length > 0) {
        alert(`Please fill in all payment fields: ${missingPaymentFields.join(', ')}`);
        return;
      }

      // Validate card number (basic check)
      const cleanCardNumber = bookingData.cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        alert('Please enter a valid card number');
        return;
      }
    }

    // Calculate payment amount based on type
    const paymentAmount = bookingData.paymentType === 'deposit' ? bookingSummary.deposit : bookingSummary.totalPrice;
    const paymentStatus = bookingData.paymentType === 'deposit' ? 'deposit_paid' : 'paid';

    // Create booking with payment information

    try {
      // Create booking in Firebase
      console.log('💳 Processing payment and saving booking...');
      const bookingData = {
        carId: bookingSummary.car._id || bookingSummary.car.id,
        pickupDate: bookingSummary.pickupDate,
        returnDate: bookingSummary.returnDate,
        pickupLocation: bookingSummary.pickupLocation,
        returnLocation: bookingSummary.returnLocation,
        days: bookingSummary.days,
        insurance: bookingSummary.insurance,
        specialRequests: bookingSummary.specialRequests,
        totalPrice: bookingSummary.totalPrice,
        paymentMethod: bookingData.paymentMethod,
        paymentType: bookingData.paymentType,
        paymentAmount: paymentAmount,
        paymentStatus: paymentStatus
      };

      const savedBooking = await bookingServices.createBooking(bookingData, user.id);

      console.log('✅ Booking with payment saved successfully:', savedBooking.id);

      // Set confirmation state
      setConfirmedBooking({
        ...savedBooking,
        car: bookingSummary.car,
        customerInfo: bookingSummary.customerInfo,
        paymentInfo: {
          method: bookingData.paymentMethod,
          type: bookingData.paymentType,
          amount: paymentAmount,
          cardNumber: bookingData.paymentMethod === 'credit_card' ? '**** **** **** ' + bookingData.cardNumber.slice(-4) : null,
          paidAt: new Date().toISOString()
        }
      });
      setBookingConfirmed(true);
    } catch (error) {
      console.error('❌ Error in payment process:', error);
      alert('Failed to process payment. Please try again or contact support if the problem persists.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Error</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => navigate('/cars')}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Book Your Car</h1>
          <p className='text-gray-600'>Complete your booking for {car?.name}</p>
        </div>

        {/* Step Indicator */}
        <div className='mb-8'>
          <div className='flex items-center justify-center space-x-4'>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className='text-sm font-medium'>1</span>
            </div>
            <div className={`flex-1 h-1 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <span className='text-sm font-medium'>2</span>
            </div>
          </div>
          <div className='flex justify-between mt-2 text-sm text-gray-600'>
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Booking Details</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Payment</span>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {/* Car Details */}
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center space-x-4'>
              <img
                src={car?.images?.[0] || car?.image || assets.main_car}
                alt={car?.name || `${car?.brand} ${car?.model}` || 'Car'}
                className='w-24 h-24 object-cover rounded-lg shadow-md'
              />
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>{car?.name}</h2>
                <p className='text-gray-600'>{car?.model}</p>
                <p className='text-lg font-semibold text-blue-600'>{formatCurrency(car?.pricePerDay)}/day</p>
              </div>
            </div>
          </div>

          {/* Step 1: Booking Details */}
          {currentStep === 1 && (
            <form onSubmit={handleBookingDetailsSubmit} className='p-6 space-y-6'>
            {/* Dates and Location */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <span className='mr-2'>📅</span>
                  Pickup Date *
                </label>
                <input
                  type='date'
                  name='pickupDate'
                  value={bookingData.pickupDate}
                  onChange={handleInputChange}
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <span className='mr-2'>📅</span>
                  Return Date *
                </label>
                <input
                  type='date'
                  name='returnDate'
                  value={bookingData.returnDate}
                  onChange={handleInputChange}
                  min={bookingData.pickupDate || (() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <span className='mr-2'>📍</span>
                  Pickup Location *
                </label>
                <input
                  type='text'
                  name='pickupLocation'
                  value={bookingData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder='Enter pickup location'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Customer Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>First Name *</label>
                  <input
                    type='text'
                    name='firstName'
                    value={bookingData.firstName}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name *</label>
                  <input
                    type='text'
                    name='lastName'
                    value={bookingData.lastName}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
                  <input
                    type='email'
                    name='email'
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone *</label>
                  <div className='flex'>
                    <select
                      name='countryCode'
                      value={bookingData.countryCode}
                      onChange={handleInputChange}
                      className='px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='+1'>+1</option>
                      <option value='+44'>+44</option>
                      <option value='+91'>+91</option>
                    </select>
                    <input
                      type='tel'
                      name='phone'
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      className='flex-1 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Driver's License Number</label>
                <input
                  type='text'
                  name='licenseNumber'
                  value={bookingData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder='Enter license number'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* Insurance Option */}
            <div className='border-t pt-6'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='insurance'
                  checked={bookingData.insurance}
                  onChange={(e) => setBookingData(prev => ({ ...prev, insurance: e.target.checked }))}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='ml-2 text-sm text-gray-700'>Add insurance ($15/day)</span>
              </label>
            </div>

            {/* Special Requests */}
            <div className='border-t pt-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Special Requests</label>
              <textarea
                name='specialRequests'
                value={bookingData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                placeholder='Any special requests or notes...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Terms and Conditions */}
            <div className='border-t pt-6'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='termsAccepted'
                  checked={bookingData.termsAccepted}
                  onChange={(e) => setBookingData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  required
                />
                <span className='ml-2 text-sm text-gray-700'>
                  I agree to the <a href='#' className='text-blue-600 hover:underline'>Terms and Conditions</a>
                </span>
              </label>
            </div>

            {/* Price Summary */}
            <div className='border-t pt-6'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 mb-4'>Booking Summary</h4>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Car Rental ({calculateTotalDays()} days):</span>
                    <span className='font-medium'>{formatCurrency(calculateTotalDays() * (car?.pricePerDay || 0))}</span>
                  </div>
                  {bookingData.insurance && (
                    <div className='flex justify-between'>
                      <span>Insurance ({calculateTotalDays()} days):</span>
                      <span className='font-medium'>{formatCurrency(calculateTotalDays() * 15)}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span>Tax (8%):</span>
                    <span className='font-medium'>{formatCurrency((calculateTotalDays() * (car?.pricePerDay || 0) + (bookingData.insurance ? calculateTotalDays() * 15 : 0)) * 0.08)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Security Deposit:</span>
                    <span className='font-medium'>{formatCurrency(Math.min(car?.pricePerDay * 0.5, 500))}</span>
                  </div>
                  <div className='border-t pt-2 mt-2'>
                    <div className='flex justify-between font-semibold text-lg'>
                      <span>Total Amount:</span>
                      <span>{formatCurrency(calculateTotalPrice())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-4 pt-6'>
              <button
                type='button'
                onClick={() => navigate('/cars')}
                className='px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={!bookingData.termsAccepted}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Continue to Payment
              </button>
            </div>
          </form>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && bookingSummary && (
            <div className='p-6 space-y-6'>
              {/* Booking Summary Review */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Booking Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Car Rental ({bookingSummary.days} days):</span>
                    <span className='font-medium'>{formatCurrency(bookingSummary.basePrice)}</span>
                  </div>
                  {bookingSummary.insurance && (
                    <div className='flex justify-between'>
                      <span>Insurance ({bookingSummary.days} days):</span>
                      <span className='font-medium'>{formatCurrency(bookingSummary.insuranceCost)}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span>Tax (8%):</span>
                    <span className='font-medium'>{formatCurrency(bookingSummary.tax)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Security Deposit:</span>
                    <span className='font-medium'>{formatCurrency(bookingSummary.deposit)}</span>
                  </div>
                  <div className='border-t pt-2 mt-2'>
                    <div className='flex justify-between font-semibold text-lg'>
                      <span>Total Amount:</span>
                      <span>{formatCurrency(bookingSummary.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className='space-y-6'>
                {/* Payment Type Selection */}
                <div className='border-t pt-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Payment Options</h3>
                  <div className='space-y-3'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='paymentType'
                        value='full'
                        checked={bookingData.paymentType === 'full'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        Pay Full Amount ({formatCurrency(bookingSummary.totalPrice)})
                      </span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='paymentType'
                        value='deposit'
                        checked={bookingData.paymentType === 'deposit'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        Pay Security Deposit ({formatCurrency(bookingSummary.deposit)}) - Balance due at pickup
                      </span>
                    </label>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className='border-t pt-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Payment Method</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <label className='flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='credit_card'
                        checked={bookingData.paymentMethod === 'credit_card'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-3 text-sm font-medium text-gray-700'>💳 Credit/Debit Card</span>
                    </label>
                    <label className='flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='paypal'
                        checked={bookingData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-3 text-sm font-medium text-gray-700'>🅿️ PayPal</span>
                    </label>
                    <label className='flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='stripe'
                        checked={bookingData.paymentMethod === 'stripe'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-3 text-sm font-medium text-gray-700'>🔒 Stripe</span>
                    </label>
                    <label className='flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>
                      <input
                        type='radio'
                        name='paymentMethod'
                        value='bank_transfer'
                        checked={bookingData.paymentMethod === 'bank_transfer'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-3 text-sm font-medium text-gray-700'>🏦 Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Credit Card Form */}
                {bookingData.paymentMethod === 'credit_card' && (
                  <div className='border-t pt-6 space-y-6'>
                    <h4 className='text-md font-semibold text-gray-900'>Card Information</h4>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Card Number *</label>
                        <input
                          type='text'
                          name='cardNumber'
                          value={bookingData.cardNumber}
                          onChange={handleInputChange}
                          placeholder='1234 5678 9012 3456'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Expiry Month *</label>
                        <select
                          name='expiryMonth'
                          value={bookingData.expiryMonth}
                          onChange={handleInputChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        >
                          <option value=''>Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Expiry Year *</label>
                        <select
                          name='expiryYear'
                          value={bookingData.expiryYear}
                          onChange={handleInputChange}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        >
                          <option value=''>Year</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={String(new Date().getFullYear() + i)}>
                              {new Date().getFullYear() + i}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>CVV *</label>
                        <input
                          type='text'
                          name='cvv'
                          value={bookingData.cvv}
                          onChange={handleInputChange}
                          placeholder='123'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          maxLength={4}
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Cardholder Name *</label>
                        <input
                          type='text'
                          name='cardholderName'
                          value={bookingData.cardholderName}
                          onChange={handleInputChange}
                          placeholder='John Doe'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className='space-y-4'>
                      <h4 className='text-md font-semibold text-gray-900'>Billing Address</h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='md:col-span-2'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
                          <input
                            type='text'
                            name='billingAddress'
                            value={bookingData.billingAddress}
                            onChange={handleInputChange}
                            placeholder='123 Main St'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                          <input
                            type='text'
                            name='billingCity'
                            value={bookingData.billingCity}
                            onChange={handleInputChange}
                            placeholder='New York'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                          <input
                            type='text'
                            name='billingState'
                            value={bookingData.billingState}
                            onChange={handleInputChange}
                            placeholder='NY'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>ZIP Code</label>
                          <input
                            type='text'
                            name='billingZipCode'
                            value={bookingData.billingZipCode}
                            onChange={handleInputChange}
                            placeholder='10001'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                          <select
                            name='billingCountry'
                            value={bookingData.billingCountry}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            <option value='US'>United States</option>
                            <option value='CA'>Canada</option>
                            <option value='UK'>United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        name='saveCard'
                        checked={bookingData.saveCard}
                        onChange={(e) => setBookingData(prev => ({ ...prev, saveCard: e.target.checked }))}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Save card for future bookings</span>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className='border-t pt-6'>
                  <div className='bg-blue-50 rounded-lg p-4'>
                    <h4 className='font-semibold text-gray-900 mb-2'>Payment Summary</h4>
                    <div className='text-lg font-bold text-blue-600'>
                      Amount to Pay: {formatCurrency(bookingData.paymentType === 'deposit' ? bookingSummary.deposit : bookingSummary.totalPrice)}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      {bookingData.paymentType === 'deposit'
                        ? `Balance of ${formatCurrency(bookingSummary.totalPrice - bookingSummary.deposit)} due at pickup`
                        : 'Full payment processed now'
                      }
                    </p>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className='flex justify-between space-x-4 pt-6'>
                  <button
                    type='button'
                    onClick={() => setCurrentStep(1)}
                    className='px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                  >
                    ← Back to Details
                  </button>
                  <div className='flex space-x-4'>
                    <button
                      type='button'
                      onClick={() => navigate('/cars')}
                      className='px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                    >
                      💳 Complete Payment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Booking Confirmation Modal */}
        {bookingConfirmed && confirmedBooking && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
              <div className='p-8'>
                {/* Success Header */}
                <div className='text-center mb-6'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl'>✅</span>
                  </div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>Booking Submitted Successfully!</h2>
                  <p className='text-gray-600'>Your booking request has been sent to the car owner for approval.</p>
                </div>

                {/* Car Details */}
                <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Car Details</h3>
                  <div className='flex items-center space-x-4 mb-4'>
                    <img
                      src={confirmedBooking.car?.images?.[0] || confirmedBooking.car?.image || assets.main_car}
                      alt={confirmedBooking.car?.name || 'Car'}
                      className='w-20 h-20 object-cover rounded-lg shadow-md'
                    />
                    <div>
                      <h4 className='text-xl font-bold text-gray-900'>
                        {confirmedBooking.car?.brand} {confirmedBooking.car?.model}
                      </h4>
                      <p className='text-gray-600'>{confirmedBooking.car?.category} • {confirmedBooking.car?.year}</p>
                      <p className='text-lg font-semibold text-blue-600'>
                        {formatCurrency(confirmedBooking.car?.pricePerDay)}/day
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className='bg-blue-50 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Booking Details</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600'>Pickup Date</p>
                      <p className='font-medium'>{new Date(confirmedBooking.pickupDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Return Date</p>
                      <p className='font-medium'>{new Date(confirmedBooking.returnDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Duration</p>
                      <p className='font-medium'>{confirmedBooking.days} days</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Pickup Location</p>
                      <p className='font-medium'>{confirmedBooking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Insurance</p>
                      <p className='font-medium'>{confirmedBooking.insurance ? 'Included' : 'Not Included'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Total Amount</p>
                      <p className='font-bold text-lg text-blue-600'>{formatCurrency(confirmedBooking.price)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className='bg-green-50 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Payment Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600'>Payment Method</p>
                      <p className='font-medium capitalize'>{confirmedBooking.paymentInfo?.method?.replace('_', ' ') || 'Credit Card'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Payment Type</p>
                      <p className='font-medium'>
                        {confirmedBooking.paymentStatus === 'deposit_paid' ? 'Security Deposit' : 'Full Payment'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Amount Paid</p>
                      <p className='font-bold text-lg text-green-600'>{formatCurrency(confirmedBooking.paymentInfo?.amount || confirmedBooking.price)}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Payment Status</p>
                      <p className='font-medium'>
                        <span className='inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          {confirmedBooking.paymentStatus === 'deposit_paid' ? 'Deposit Paid' : 'Paid'}
                        </span>
                      </p>
                    </div>
                    {confirmedBooking.paymentInfo?.cardNumber && (
                      <div>
                        <p className='text-sm text-gray-600'>Card Used</p>
                        <p className='font-medium'>{confirmedBooking.paymentInfo.cardNumber}</p>
                      </div>
                    )}
                    {confirmedBooking.paymentStatus === 'deposit_paid' && (
                      <div>
                        <p className='text-sm text-gray-600'>Balance Due</p>
                        <p className='font-medium text-orange-600'>
                          {formatCurrency(confirmedBooking.price - (confirmedBooking.paymentInfo?.amount || 0))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Confirmation Notice */}
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
                  <div className='flex items-start space-x-3'>
                    <span className='text-xl'>⏳</span>
                    <div>
                      <h4 className='text-lg font-semibold text-yellow-800 mb-2'>Awaiting Owner Confirmation</h4>
                      <p className='text-yellow-700 mb-3'>
                        Your booking request has been submitted and is currently pending approval from the car owner.
                        You will receive a notification once the owner reviews and confirms your booking.
                      </p>
                      <div className='text-sm text-yellow-600'>
                        <p>• Booking Status: <span className='font-medium'>Pending Confirmation</span></p>
                        <p>• Expected Response: Within 24 hours</p>
                        <p>• You can check the status in your "My Bookings" section</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4'>
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={() => navigate('/cars')}
                    className='flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium'
                  >
                    Book Another Car
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className='flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium'
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;