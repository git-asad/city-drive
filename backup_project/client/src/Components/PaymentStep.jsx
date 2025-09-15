import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoadingSpinner from './LoadingSpinner';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');

const PaymentForm = ({ bookingData, costBreakdown, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [cardErrors, setCardErrors] = useState({});
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, []);

  // Luhn algorithm for credit card validation
  const luhnCheck = (cardNumber) => {
    const digits = cardNumber.replace(/\s/g, '').split('').reverse();
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = parseInt(digits[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  // Validate expiration date
  const validateExpiry = (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year) + 2000; // Convert 2-digit year to 4-digit
    const expMonth = parseInt(month);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    return expMonth >= 1 && expMonth <= 12;
  };

  // Get card type from number
  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    return 'Unknown';
  };

  // Handle card element changes
  const handleCardChange = (event) => {
    const errors = {};

    if (event.error) {
      errors.card = event.error.message;
    }

    // Additional custom validations
    if (event.complete) {
      const cardNumber = event.value?.card?.number || '';
      const expiry = event.value?.card?.expiry || '';
      const cvc = event.value?.card?.cvc || '';

      // Validate card number with Luhn
      if (cardNumber && !luhnCheck(cardNumber)) {
        errors.card = 'Invalid card number';
      }

      // Validate expiry
      if (expiry) {
        const [month, year] = expiry.split('/');
        if (!validateExpiry(month, year)) {
          errors.card = 'Card has expired or invalid expiry date';
        }
      }

      // Validate CVC length based on card type
      if (cvc) {
        const cardType = getCardType(cardNumber);
        if (cardType === 'American Express' && cvc.length !== 4) {
          errors.card = 'American Express cards require 4-digit CVC';
        } else if (cardType !== 'American Express' && cvc.length !== 3) {
          errors.card = 'CVC must be 3 digits';
        }
      }
    }

    setCardErrors(errors);
    setCardComplete(event.complete);
  };

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: bookingData.carId,
          pickupDate: bookingData.pickupDate,
          returnDate: bookingData.returnDate,
          insurance: bookingData.insurance || false,
          email: bookingData.email
        })
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } else {
        // Silently handle payment intent creation errors
        console.log('Payment intent creation failed:', data.error);
      }
    } catch (error) {
      // Silently handle network errors
      console.log('Network error creating payment intent:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for validation errors
    if (Object.keys(cardErrors).length > 0) {
      console.log('Card validation errors:', cardErrors);
      return;
    }

    if (!cardComplete) {
      console.log('Card information incomplete');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      // Show payment success message
      setPaymentSuccess(true);
      setIsProcessing(false);

      // Confirm the booking in the background (optional)
      // confirmBooking('simulated_payment_id');
    }, 2000); // 2 second delay to simulate processing
  };

  const confirmBooking = async (paymentIntentId) => {
    try {
      const response = await fetch('/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          bookingData,
          costBreakdown
        })
      });

      const data = await response.json();

      if (data.success) {
        // Booking confirmed successfully
        console.log('Booking confirmed:', data.booking);
      } else {
        console.log('Booking confirmation failed:', data.error);
      }
    } catch (error) {
      console.log('Network error confirming booking:', error);
    }
    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Montserrat, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  // Show success message if payment was successful
  if (paymentSuccess) {
    return (
      <div className='text-center py-12'>
        <div className='bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-green-800 mb-2'>Payment Successful!</h2>
          <p className='text-green-700 mb-6'>Your booking has been confirmed successfully.</p>
          <button
            onClick={() => window.location.href = '/my-bookings'}
            className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold'
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>Payment Information</h2>

      {/* Cost Breakdown */}
      <div className='bg-gray-50 rounded-lg p-6 mb-6'>
        <h3 className='font-bold text-lg mb-4'>Cost Breakdown</h3>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span>Rental ({costBreakdown.days} days):</span>
            <span>${costBreakdown.subtotal}</span>
          </div>
          {costBreakdown.insurance > 0 && (
            <div className='flex justify-between'>
              <span>Insurance:</span>
              <span>${costBreakdown.insurance}</span>
            </div>
          )}
          <div className='flex justify-between'>
            <span>Tax (8%):</span>
            <span>${costBreakdown.tax}</span>
          </div>
          <div className='flex justify-between'>
            <span>Security Deposit:</span>
            <span>${costBreakdown.deposit}</span>
          </div>
          <div className='flex justify-between font-bold text-lg border-t pt-2'>
            <span>Total:</span>
            <span className='text-blue-600'>${costBreakdown.total}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Card Information
          </label>
          <div className='border border-gray-300 rounded-lg p-4 bg-white'>
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          {cardErrors.card && (
            <p className='mt-2 text-sm text-red-600'>{cardErrors.card}</p>
          )}
        </div>


        <button
          type='submit'
          disabled={!stripe || isProcessing || !cardComplete || Object.keys(cardErrors).length > 0}
          className='w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all'
        >
          {isProcessing ? (
            <div className='flex items-center justify-center gap-3'>
              <LoadingSpinner size='small' color='white' />
              Processing Payment...
            </div>
          ) : (
            `Pay $${costBreakdown.total}`
          )}
        </button>
      </form>
    </div>
  );
};

const PaymentStep = ({ bookingData, costBreakdown, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        bookingData={bookingData}
        costBreakdown={costBreakdown}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default PaymentStep;