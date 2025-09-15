import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: '1990-01-01',
    licenseNumber: 'DL123456789',
    licenseExpiry: '2025-12-31'
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Update local state
    setUserData({ ...editForm });
    setIsEditing(false);

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(editForm));

    // Update AuthContext user data for consistency across the app
    if (user) {
      const updatedUser = {
        ...user,
        name: `${editForm.firstName} ${editForm.lastName}`,
        email: editForm.email
      };

      // Update userData in localStorage for AuthContext
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      // Refresh AuthContext to trigger re-renders in components using user data
      refreshUserData();
      console.log('🔄 Profile updated - AuthContext user data synchronized and refreshed');
    }

    alert('Profile updated successfully! Changes will be reflected throughout the application.');
  };

  const handleCancel = () => {
    setEditForm({ ...userData });
    setIsEditing(false);
  };

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserData(profile);
      setEditForm(profile);
    } else if (user) {
      // If no saved profile but user is authenticated, use auth data
      const initialProfile = {
        firstName: user.name?.split(' ')[0] || 'John',
        lastName: user.name?.split(' ')[1] || 'Doe',
        email: user.email || 'john.doe@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main St, New York, NY 10001',
        dateOfBirth: '1990-01-01',
        licenseNumber: 'DL123456789',
        licenseExpiry: '2025-12-31'
      };
      setUserData(initialProfile);
      setEditForm(initialProfile);
    }
  }, [user]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
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
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Profile Header */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
                <p className='text-gray-600 mt-1'>Manage your account information</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Picture Section */}
            <div className='flex items-center gap-6 mb-8'>
              <div className='w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-2xl font-bold text-blue-600'>
                  {userData.firstName[0]}{userData.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className='text-gray-600'>{userData.email}</p>
                <p className='text-sm text-gray-500 mt-1'>
                  {user?.role === 'owner' ? 'Owner Account' : 'Member since 2024'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className='bg-white rounded-2xl shadow-lg p-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Personal Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* First Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editForm.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editForm.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type='email'
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type='date'
                    value={editForm.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>
                    {new Date(userData.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Address
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter your address'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.address}</p>
                )}
              </div>
            </div>

            {/* Driver's License Information */}
            <h3 className='text-xl font-semibold text-gray-900 mb-6 mt-8'>Driver's License</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  License Number
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={editForm.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>{userData.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  License Expiry Date
                </label>
                {isEditing ? (
                  <input
                    type='date'
                    value={editForm.licenseExpiry}
                    onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 py-3 px-4 bg-gray-50 rounded-lg'>
                    {new Date(userData.licenseExpiry).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className='flex gap-4 mt-8'>
                <button
                  onClick={handleSave}
                  className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className='px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Preferences</h3>

            <div className='space-y-6'>
              <div>
                <h4 className='font-medium text-gray-900 mb-3'>Preferred Car Types</h4>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {['SUV', 'Sedan', 'Hatchback', 'Convertible'].map((type) => (
                    <label key={type} className='flex items-center'>
                      <input type='checkbox' className='mr-2 text-blue-600' defaultChecked={type === 'SUV'} />
                      <span className='text-sm text-gray-700'>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className='font-medium text-gray-900 mb-3'>Communication Preferences</h4>
                <div className='space-y-3'>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-3 text-blue-600' defaultChecked />
                    <span className='text-sm text-gray-700'>Email booking confirmations</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-3 text-blue-600' defaultChecked />
                    <span className='text-sm text-gray-700'>SMS booking reminders</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-3 text-blue-600' />
                    <span className='text-sm text-gray-700'>Promotional offers and discounts</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-3 text-blue-600' />
                    <span className='text-sm text-gray-700'>Newsletter and updates</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Recent Bookings</h3>

            <div className='space-y-4'>
              {[
                { id: 'BK001', car: 'BMW X5', date: '2024-01-15', status: 'Completed', amount: '$285' },
                { id: 'BK002', car: 'Toyota Corolla', date: '2024-01-10', status: 'Completed', amount: '$130' },
                { id: 'BK003', car: 'Jeep Wrangler', date: '2024-01-05', status: 'Cancelled', amount: '$200' }
              ].map((booking) => (
                <div key={booking.id} className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                      <span className='text-sm font-bold text-blue-600'>🚗</span>
                    </div>
                    <div>
                      <h4 className='font-medium text-gray-900'>{booking.car}</h4>
                      <p className='text-sm text-gray-600'>Booking #{booking.id} • {booking.date}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-900'>{booking.amount}</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6 text-center'>
              <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                View All Bookings
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Account Settings</h3>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Change Password</h4>
                  <p className='text-sm text-gray-600'>Update your account password for better security</p>
                </div>
                <button className='px-4 py-2 text-blue-600 hover:text-blue-800 font-medium'>
                  Change
                </button>
              </div>

              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Two-Factor Authentication</h4>
                  <p className='text-sm text-gray-600'>Add an extra layer of security to your account</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Email Notifications</h4>
                  <p className='text-sm text-gray-600'>Receive booking confirmations and important updates</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Data Export</h4>
                  <p className='text-sm text-gray-600'>Download your booking history and personal data</p>
                </div>
                <button className='px-4 py-2 text-blue-600 hover:text-blue-800 font-medium'>
                  Export
                </button>
              </div>

              <div className='flex items-center justify-between p-4 border border-red-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-red-900'>Delete Account</h4>
                  <p className='text-sm text-red-600'>Permanently delete your account and all associated data</p>
                </div>
                <button className='px-4 py-2 text-red-600 hover:text-red-800 font-medium'>
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Support & Help */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Support & Help</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>📞 Contact Support</h4>
                <p className='text-sm text-gray-600 mb-3'>Need help with your account or bookings?</p>
                <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                  Contact Us
                </button>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>📚 Help Center</h4>
                <p className='text-sm text-gray-600 mb-3'>Find answers to common questions</p>
                <button className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm'>
                  Browse FAQ
                </button>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>💬 Live Chat</h4>
                <p className='text-sm text-gray-600 mb-3'>Chat with our support team</p>
                <button className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
                  Start Chat
                </button>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>📱 App Feedback</h4>
                <p className='text-sm text-gray-600 mb-3'>Help us improve your experience</p>
                <button className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm'>
                  Give Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;