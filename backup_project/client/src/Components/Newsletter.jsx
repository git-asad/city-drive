import React, { useState } from 'react';
import { newsletterAPI } from '../utils/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await newsletterAPI.subscribe({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        preferences: {
          cars: true,
          deals: true,
          news: false,
          locations: []
        }
      });

      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setMessageType('success');
      setEmail('');
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage(error.message || 'Failed to subscribe. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden animate-fade-in-up">

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl'></div>
      </div>

      <div className='z-10 max-w-4xl mx-auto'>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Never Miss a Deal!</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center max-w-2xl w-full mx-auto gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              type="text"
              placeholder="Last name (optional)"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>
        <p className="text-sm text-white/60 mt-6">
          Join 500+ subscribers. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}

export default Newsletter
