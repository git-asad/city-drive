import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/Navbar';
import CarDetails from './pages/CarDetails';
import Home from './pages/Home';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import Settings from './pages/Settings';
import EditCar from './pages/EditCar';
import AddCar from './pages/AddCar';
import ManageCars from './pages/ManageCars';
import ManageBookings from './pages/ManageBookings';
import Footer from './Components/Footer';
import { initializeBookingStorage } from './utils/bookingStorage';

const AppContent = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner') || location.pathname === '/dashboard';

  // Initialize booking storage on app load
  useEffect(() => {
    initializeBookingStorage();
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } />

        {/* Protected Routes for All Authenticated Users */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/car-details/:id' element={
          <ProtectedRoute>
            <CarDetails />
          </ProtectedRoute>
        } />
        <Route path='/cars' element={
          <ProtectedRoute>
            <Cars />
          </ProtectedRoute>
        } />
        <Route path='/booking/:id' element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />

        {/* Customer Only Routes */}
        <Route path='/my-bookings' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Owner Only Routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path='/settings' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path='/owner' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path='/owner/edit-car/:id' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <EditCar />
          </ProtectedRoute>
        } />
        <Route path='/owner/add-car' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddCar />
          </ProtectedRoute>
        } />
        <Route path='/owner/manage-cars' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ManageCars />
          </ProtectedRoute>
        } />
        <Route path='/owner/manage-bookings' element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ManageBookings />
          </ProtectedRoute>
        } />
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;