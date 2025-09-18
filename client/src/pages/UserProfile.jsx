import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
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
    setUserData({ ...editForm });
    setIsEditing(false);
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    alert('Profile updated successfully!');
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
    }
  }, []);

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
                <p className='text-sm text-gray-500 mt-1'>Member since 2024</p>
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

          {/* Account Settings */}
          <div className='bg-white rounded-2xl shadow-lg p-8 mt-8'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Account Settings</h3>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Change Password</h4>
                  <p className='text-sm text-gray-600'>Update your account password</p>
                </div>
                <button className='px-4 py-2 text-blue-600 hover:text-blue-800 font-medium'>
                  Change
                </button>
              </div>

              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-gray-900'>Email Notifications</h4>
                  <p className='text-sm text-gray-600'>Receive booking confirmations and updates</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className='flex items-center justify-between p-4 border border-red-200 rounded-lg'>
                <div>
                  <h4 className='font-medium text-red-900'>Delete Account</h4>
                  <p className='text-sm text-red-600'>Permanently delete your account and all data</p>
                </div>
                <button className='px-4 py-2 text-red-600 hover:text-red-800 font-medium'>
                  Delete
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