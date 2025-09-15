import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user, loading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated() && user) {
      const from = location.state?.from?.pathname || getDefaultRoute(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate, location]);

  const getDefaultRoute = (role) => {
    return role === 'owner' ? '/dashboard' : '/home';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          navigate('/home');
        } else {
          setError(result.error);
        }
      } else {
        // Login
        const result = await login(formData.email, formData.password);

        if (result.success) {
          const redirectTo = location.state?.from?.pathname || getDefaultRoute(result.user.role);
          navigate(redirectTo);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <img
            src={assets.logo}
            alt="Logo"
            className='mx-auto h-12 w-auto'
          />
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {isSignUp
              ? 'Join us to start booking amazing cars'
              : 'Welcome back! Please sign in to continue'
            }
          </p>
          {location.state?.message && (
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800 font-medium'>{location.state.message}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className='bg-white py-8 px-6 shadow-xl rounded-2xl'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Name Field (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm'
                  placeholder='Enter your full name'
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleInputChange}
                className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm'
                placeholder='Enter your email'
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm'
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
              />
            </div>

            {/* Confirm Password Field (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm'
                  placeholder='Confirm your password'
                />
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Toggle Mode */}
          <div className='mt-6 text-center'>
            <button
              onClick={toggleMode}
              className='text-sm text-blue-600 hover:text-blue-500 font-medium'
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
          <h4 className='text-sm font-medium text-yellow-800 mb-2'>Test Accounts (for development):</h4>
          <div className='text-xs text-yellow-700 space-y-1'>
            <p><strong>Owner:</strong> asadtft456@gmail.com / asadtft654@gmail.com</p>
            <p><strong>Client:</strong> client123@example.com / clientpass123</p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center text-sm text-gray-600'>
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;