import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import LoadingSpinner from './LoadingSpinner';
import { bookingAPI } from '../utils/api';

const PayPalPayment = ({ bookingData, costBreakdown, onPaymentSuccess, onPaymentError }) => {
  console.log('PayPalPayment render #', Math.random());
  console.log('React version:', React.version);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (data, actions) => {
    try {
      setIsProcessing(true);
      setError(null);
      const response = await bookingAPI.createPayPalOrder({
        amount: costBreakdown.total,
        currency: 'USD',
        bookingData
      });
      if (response.success) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: costBreakdown.total.toFixed(2),
                currency_code: 'USD'
              },
              description: `Car Rental Booking - ${bookingData.car.brand} ${bookingData.car.model}`,
              custom_id: response.orderId // Use backend-generated order ID if needed
            }
          ]
        });
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
      return null;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      const response = await bookingAPI.capturePayPalOrder({
        orderId: order.id,
        bookingData,
        costBreakdown
      });
      if (response.success) {
        onPaymentSuccess(response.booking);
      } else {
        throw new Error(response.error || 'Payment capture failed');
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err) => {
    setError('PayPal payment error: ' + err.message);
    onPaymentError(err.message);
    setIsProcessing(false);
  };

  const onCancel = () => {
    setError('Payment cancelled');
    setIsProcessing(false);
  };

  // Cost Breakdown Display
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment with PayPal</h2>

      {/* Cost Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Rental ({costBreakdown.days} days):</span>
            <span>${costBreakdown.subtotal}</span>
          </div>
          {costBreakdown.insurance > 0 && (
            <div className="flex justify-between">
              <span>Insurance:</span>
              <span>${costBreakdown.insurance}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>${costBreakdown.tax}</span>
          </div>
          <div className="flex justify-between">
            <span>Security Deposit:</span>
            <span>${costBreakdown.deposit}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-blue-600">${costBreakdown.total}</span>
          </div>
        </div>
      </div>

      {/* PayPal Buttons */}
      <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
        <div className="bg-white rounded-lg p-6 border">
          <PayPalButtons
            style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            disabled={isProcessing}
          />
        </div>
      </PayPalScriptProvider>

      {isProcessing && (
        <div className="mt-4 flex items-center justify-center">
          <LoadingSpinner size="small" />
          <span className="ml-2">Processing payment...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>Secure payment processed via PayPal. Your booking will be confirmed upon successful payment.</p>
      </div>
    </div>
  );
};

export default PayPalPayment;