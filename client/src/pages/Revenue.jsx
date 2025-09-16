import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { revenueServices } from '../services/firebaseServices';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const Revenue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load revenue data from Firebase
        console.log('📊 Loading revenue data for owner...');
        const [revenueData, total] = await Promise.all([
          revenueServices.getOwnerRevenue(user.id),
          revenueServices.getTotalRevenue(user.id)
        ]);

        console.log(`✅ Owner loaded ${revenueData.length} revenue records, total: $${total}`);
        setRevenues(revenueData);
        setTotalRevenue(total);

      } catch (err) {
        console.error('❌ Error loading revenue data:', err);
        setError('Failed to load revenue data. Please refresh the page or contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadRevenueData();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredRevenues = revenues.filter(revenue => {
    if (filterPeriod === 'all') return true;

    const revenueDate = new Date(revenue.createdAt?.toDate?.() || revenue.createdAt);
    const now = new Date();

    switch (filterPeriod) {
      case 'today':
        return revenueDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return revenueDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return revenueDate >= monthAgo;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return revenueDate >= yearAgo;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <div className='w-64 bg-white shadow-lg'></div>
        <div className='flex-1 p-8 flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <div className='w-64 bg-white shadow-lg'></div>
        <div className='flex-1 p-8 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-xl font-bold text-red-600 mb-2'>Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <img src={assets.user_profile} alt="Profile" className='w-12 h-12 rounded-full' />
            <div>
              <h3 className='font-semibold text-gray-900'>GreatStack</h3>
              <p className='text-sm text-gray-500'>admin@example.com</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <button
                onClick={() => navigate('/owner')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.dashboardIcon} alt="Dashboard" className='w-5 h-5' />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/add-car')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.addIcon} alt="Add Car" className='w-5 h-5' />
                Add car
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-cars')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.carIcon} alt="Manage Cars" className='w-5 h-5' />
                Manage Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/manage-bookings')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                <img src={assets.listIcon} alt="Manage Bookings" className='w-5 h-5' />
                Manage Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/owner/revenue')}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              >
                <img src={assets.listIconColored} alt="Revenue" className='w-5 h-5' />
                Revenue
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex justify-between items-center'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Revenue Dashboard</h1>
                <p className='text-gray-600'>Track your earnings and financial performance</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>Total Revenue</h2>
                <p className='text-green-100'>All-time earnings from confirmed bookings</p>
              </div>
              <div className='text-right'>
                <div className='text-4xl font-bold'>{formatCurrency(totalRevenue)}</div>
                <div className='text-green-100 text-sm'>+12% from last month</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Filter by Period</label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='all'>All Time</option>
                  <option value='today'>Today</option>
                  <option value='week'>This Week</option>
                  <option value='month'>This Month</option>
                  <option value='year'>This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Revenue List */}
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-xl font-bold text-gray-900'>Revenue History</h3>
              <p className='text-gray-600 text-sm mt-1'>Detailed breakdown of all earnings</p>
            </div>

            <div className='divide-y divide-gray-200'>
              {filteredRevenues.length === 0 ? (
                <div className='p-8 text-center'>
                  <img src={assets.listIcon} alt="No revenue" className='w-16 h-16 mx-auto mb-4 opacity-50' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>No revenue records found</h3>
                  <p className='text-gray-600'>Revenue will appear here once bookings are confirmed.</p>
                </div>
              ) : (
                filteredRevenues.map((revenue) => (
                  <div key={revenue.id} className='p-6 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                          <span className='text-green-600 text-xl'>💰</span>
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            Revenue from Booking #{revenue.bookingId?.substring(0, 8) || 'N/A'}
                          </h4>
                          <p className='text-gray-600 text-sm'>
                            {formatDate(revenue.createdAt?.toDate?.() || revenue.createdAt)}
                          </p>
                          <p className='text-gray-500 text-xs mt-1'>
                            Car ID: {revenue.carId?.substring(0, 8) || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className='text-right'>
                        <div className='text-2xl font-bold text-green-600'>{formatCurrency(revenue.amount)}</div>
                        <div className='text-sm text-gray-500'>Confirmed booking</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredRevenues.length > 0 && (
              <div className='p-6 bg-gray-50'>
                <div className='flex justify-between items-center'>
                  <div className='text-sm text-gray-600'>
                    Showing {filteredRevenues.length} of {revenues.length} revenue records
                  </div>
                  <div className='text-lg font-bold text-gray-900'>
                    Filtered Total: {formatCurrency(filteredRevenues.reduce((sum, r) => sum + r.amount, 0))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;