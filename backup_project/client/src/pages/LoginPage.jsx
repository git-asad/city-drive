import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration specific validation
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);

        // Redirect will happen automatically via AuthContext
        navigate('/');
      } else {
        // Register
        await signup(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);

        // Redirect will happen automatically via AuthContext
        navigate('/');
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      try {
        setIsLoading(true);
        await loginWithGoogle();
        // Redirect will happen automatically via AuthContext
        navigate('/');
      } catch (error) {
        console.error('Google login error:', error);
        setErrors({
          submit: error.message || 'Google login failed. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Facebook login (placeholder)
      alert(`${provider} login is not implemented yet`);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Header with Back Button */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Back
            </button>
            <div className='text-center flex-1'>
              <img
                src={assets.logo}
                alt="City Drive"
                className='mx-auto h-8 w-auto'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          {/* Header */}
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900'>
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              {isLogin
                ? 'Welcome back! Please sign in to continue'
                : 'Join City Drive for the best car rental experience'
              }
            </p>
          </div>

        {/* Form */}
        <div className='bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100'>
          <form className='space-y-6' onSubmit={handleSubmit}>

            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-1'>
                      First Name
                    </label>
                    <input
                      id='firstName'
                      name='firstName'
                      type='text'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='John'
                    />
                    {errors.firstName && (
                      <p className='mt-1 text-sm text-red-600'>{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-1'>
                      Last Name
                    </label>
                    <input
                      id='lastName'
                      name='lastName'
                      type='text'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Doe'
                    />
                    {errors.lastName && (
                      <p className='mt-1 text-sm text-red-600'>{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone Number
                  </label>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='+1 (555) 123-4567'
                  />
                  {errors.phone && (
                    <p className='mt-1 text-sm text-red-600'>{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='john@example.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='Enter your password'
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Confirm your password'
                />
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='rememberMe'
                    name='rememberMe'
                    type='checkbox'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>
                    Remember me
                  </label>
                </div>
                <div className='text-sm'>
                  <a href='#' className='text-blue-600 hover:text-blue-500 font-medium'>
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm text-red-600'>{errors.submit}</p>
              </div>
            )}

            {/* Social Login */}
            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>Or continue with</span>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3'>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Google')}
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'
                >
                  <img src={assets.gmail_logo} alt='Google' className='w-5 h-5 mr-2' />
                  Google
                </button>
                <button
                  type='button'
                  onClick={() => handleSocialLogin('Facebook')}
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors'
                >
                  <img src={assets.facebook_logo} alt='Facebook' className='w-5 h-5 mr-2' />
                  Facebook
                </button>
              </div>
            </div>
          </form>

          {/* Toggle between Login/Register */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type='button'
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phone: ''
                  }));
                }}
                className='ml-1 text-blue-600 hover:text-blue-500 font-medium'
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-yellow-800 mb-2'>Demo Credentials</h3>
          <div className='text-xs text-yellow-700 space-y-1'>
            <p><strong>Owner:</strong> admin@example.com / admin123</p>
            <p><strong>Client:</strong> asadclient456@gmail.com / asadclient654</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;