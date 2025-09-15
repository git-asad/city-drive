import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import CarDetails from './pages/CarDetails';
import Home from './pages/Home';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import EditCar from './pages/EditCar';
import AddCar from './pages/AddCar';
import ManageCars from './pages/ManageCars';
import ManageBookings from './pages/ManageBookings';
import Footer from './Components/Footer';

const App = () => {
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
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/owner' element={<OwnerDashboard />} />
        <Route path='/owner/edit-car/:id' element={<EditCar />} />
        <Route path='/owner/add-car' element={<AddCar />} />
        <Route path='/owner/manage-cars' element={<ManageCars />} />
        <Route path='/owner/manage-bookings' element={<ManageBookings />} />
      </Routes>
      {!isOwnerpath && <Footer />}

    </>
  );
};

export default App;