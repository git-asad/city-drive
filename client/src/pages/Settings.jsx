import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: ''
  });

  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: 'Test Client Car Rental',
    siteDescription: 'Premium car rental services',
    contactEmail: 'info@testclient.com',
    contactPhone: '+1 (555) 123-4567',
    businessHours: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM',
    maintenanceMode: false,
    allowBookings: true,
    currency: 'USD',
    timezone: 'America/New_York'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true,
    paymentReminders: true,
    maintenanceAlerts: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Save profile data
    localStorage.setItem('ownerProfile', JSON.stringify(profileData));
    alert('Profile updated successfully!');
  };

  const handleWebsiteSettingsUpdate = (e) => {
    e.preventDefault();
    // Save website settings
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
    alert('Website settings updated successfully!');
  };

  const handleNotificationSettingsUpdate = (e) => {
    e.preventDefault();
    // Save notification settings
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    alert('Notification settings updated successfully!');
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'website') {
      setWebsiteSettings(prev => ({ ...prev, [field]: value }));
    } else if (section === 'notifications') {
      setNotificationSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('ownerProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    const savedWebsiteSettings = localStorage.getItem('websiteSettings');
    if (savedWebsiteSettings) {
      setWebsiteSettings(JSON.parse(savedWebsiteSettings));
    }

    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings));
    }
  }, []);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: assets.user_profile },
    { id: 'website', name: 'Website', icon: assets.edit_icon },
    { id: 'notifications', name: 'Notifications', icon: assets.check_icon }
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Settings</h1>
          <p className='text-gray-600'>Manage your account and website settings</p>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          {/* Tab Navigation */}
          <div className='border-b border-gray-200'>
            <nav className='flex'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <img src={tab.icon} alt="" className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                      <input
                        type='text'
                        value={profileData.name}
                        onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                      <input
                        type='email'
                        value={profileData.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                      <input
                        type='tel'
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Business Name</label>
                      <input
                        type='text'
                        value={profileData.businessName}
                        onChange={(e) => handleInputChange('profile', 'businessName', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Business Address</label>
                    <textarea
                      value={profileData.businessAddress}
                      onChange={(e) => handleInputChange('profile', 'businessAddress', e.target.value)}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Business Phone</label>
                      <input
                        type='tel'
                        value={profileData.businessPhone}
                        onChange={(e) => handleInputChange('profile', 'businessPhone', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Business Email</label>
                      <input
                        type='email'
                        value={profileData.businessEmail}
                        onChange={(e) => handleInputChange('profile', 'businessEmail', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Website Settings Tab */}
            {activeTab === 'website' && (
              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Website Settings</h2>
                <form onSubmit={handleWebsiteSettingsUpdate} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Site Name</label>
                      <input
                        type='text'
                        value={websiteSettings.siteName}
                        onChange={(e) => handleInputChange('website', 'siteName', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Email</label>
                      <input
                        type='email'
                        value={websiteSettings.contactEmail}
                        onChange={(e) => handleInputChange('website', 'contactEmail', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Phone</label>
                      <input
                        type='tel'
                        value={websiteSettings.contactPhone}
                        onChange={(e) => handleInputChange('website', 'contactPhone', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Currency</label>
                      <select
                        value={websiteSettings.currency}
                        onChange={(e) => handleInputChange('website', 'currency', e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value='USD'>USD ($)</option>
                        <option value='EUR'>EUR (€)</option>
                        <option value='GBP'>GBP (£)</option>
                        <option value='CAD'>CAD (C$)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Site Description</label>
                    <textarea
                      value={websiteSettings.siteDescription}
                      onChange={(e) => handleInputChange('website', 'siteDescription', e.target.value)}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Business Hours</label>
                    <input
                      type='text'
                      value={websiteSettings.businessHours}
                      onChange={(e) => handleInputChange('website', 'businessHours', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='maintenanceMode'
                        checked={websiteSettings.maintenanceMode}
                        onChange={(e) => handleInputChange('website', 'maintenanceMode', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <label htmlFor='maintenanceMode' className='ml-2 text-sm text-gray-700'>
                        Enable Maintenance Mode
                      </label>
                    </div>

                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='allowBookings'
                        checked={websiteSettings.allowBookings}
                        onChange={(e) => handleInputChange('website', 'allowBookings', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <label htmlFor='allowBookings' className='ml-2 text-sm text-gray-700'>
                        Allow New Bookings
                      </label>
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Save Website Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Notification Settings</h2>
                <form onSubmit={handleNotificationSettingsUpdate} className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>Email Notifications</h3>
                        <p className='text-sm text-gray-600'>Receive notifications via email</p>
                      </div>
                      <input
                        type='checkbox'
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>

                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>SMS Notifications</h3>
                        <p className='text-sm text-gray-600'>Receive notifications via SMS</p>
                      </div>
                      <input
                        type='checkbox'
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>

                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>Booking Confirmations</h3>
                        <p className='text-sm text-gray-600'>Get notified when bookings are confirmed</p>
                      </div>
                      <input
                        type='checkbox'
                        checked={notificationSettings.bookingConfirmations}
                        onChange={(e) => handleInputChange('notifications', 'bookingConfirmations', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>

                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>Payment Reminders</h3>
                        <p className='text-sm text-gray-600'>Receive payment reminder notifications</p>
                      </div>
                      <input
                        type='checkbox'
                        checked={notificationSettings.paymentReminders}
                        onChange={(e) => handleInputChange('notifications', 'paymentReminders', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>

                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>Maintenance Alerts</h3>
                        <p className='text-sm text-gray-600'>Get alerts about system maintenance</p>
                      </div>
                      <input
                        type='checkbox'
                        checked={notificationSettings.maintenanceAlerts}
                        onChange={(e) => handleInputChange('notifications', 'maintenanceAlerts', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Save Notification Settings
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;