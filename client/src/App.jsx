import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import CarDetails from './pages/CarDetails';
import Home from './pages/Home';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ClientLoginPage from './pages/ClientLoginPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import UserProfile from './pages/UserProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import EditCar from './pages/EditCar';
import AddCar from './pages/AddCar';
import ManageCars from './pages/ManageCars';
import ManageBookings from './pages/ManageBookings';
import Revenue from './pages/Revenue';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import About from './pages/About';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';

const AppContent = () => {
  const isOwnerpath = useLocation().pathname.startsWith('/owner');

  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/booking/:id' element={<BookingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/client-login' element={<ClientLoginPage />} />
        <Route path='/owner-login' element={<OwnerLoginPage />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/settings' element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path='/my-bookings' element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/terms' element={<TermsOfService />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/owner' element={<OwnerDashboard />} />
        <Route path='/owner/edit-car/:id' element={<EditCar />} />
        <Route path='/owner/add-car' element={<AddCar />} />
        <Route path='/owner/manage-cars' element={<ManageCars />} />
        <Route path='/owner/manage-bookings' element={<ManageBookings />} />
        <Route path='/owner/revenue' element={<Revenue />} />
        {/* Catch-all route for 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      {!isOwnerpath && <Footer />}

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