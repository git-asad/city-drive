import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🚗</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🏠 Go Home
          </Link>

          <Link
            to="/cars"
            className="inline-block w-full bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            🚗 Browse Cars
          </Link>

          <Link
            to="/contact"
            className="inline-block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            📞 Contact Support
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about" className="text-indigo-600 hover:text-indigo-800">About</Link>
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">Contact</Link>
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-800">Terms</Link>
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;