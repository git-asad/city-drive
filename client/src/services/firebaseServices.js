import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Car Services
export const carServices = {
  // Get all cars
  async getAllCars() {
    try {
      const carsRef = collection(db, 'cars');
      const q = query(carsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

      return cars;
    } catch (error) {
      console.error('Error getting cars:', error);
      throw error;
    }
  },

  // Get car by ID
  async getCarById(carId) {
    try {
      const carDoc = await getDoc(doc(db, 'cars', carId));
      if (carDoc.exists()) {
        return { id: carDoc.id, ...carDoc.data() };
      } else {
        throw new Error('Car not found');
      }
    } catch (error) {
      console.error('Error getting car:', error);
      throw error;
    }
  },

  // Add new car
  async addCar(carData) {
    try {
      const carsRef = collection(db, 'cars');
      const docRef = await addDoc(carsRef, {
        ...carData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding car:', error);
      throw error;
    }
  },

  // Update car
  async updateCar(carId, carData) {
    try {
      const carRef = doc(db, 'cars', carId);
      await updateDoc(carRef, {
        ...carData,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  // Delete car
  async deleteCar(carId) {
    try {
      await deleteDoc(doc(db, 'cars', carId));
      return true;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }
};

// Booking Services
export const bookingServices = {
  // Get user bookings
  async getUserBookings(userId) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },

  // Get all bookings (for admin)
  async getAllBookings() {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      console.error('Error getting all bookings:', error);
      throw error;
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        createdAt: new Date(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: status,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
};

// Review Services
export const reviewServices = {
  // Get reviews for a car
  async getCarReviews(carId) {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('carId', '==', carId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return reviews;
    } catch (error) {
      console.error('Error getting car reviews:', error);
      throw error;
    }
  },

  // Add review
  async addReview(reviewData) {
    try {
      const reviewsRef = collection(db, 'reviews');
      const docRef = await addDoc(reviewsRef, {
        ...reviewData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};

// Revenue Services
export const revenueServices = {
  // Get revenue data
  async getRevenueData(ownerId) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('ownerId', '==', ownerId),
        where('status', '==', 'completed')
      );
      const querySnapshot = await getDocs(q);

      let totalRevenue = 0;
      const revenueData = [];

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        totalRevenue += booking.totalAmount || 0;
        revenueData.push({
          id: doc.id,
          ...booking
        });
      });

      return {
        totalRevenue,
        bookings: revenueData
      };
    } catch (error) {
      console.error('Error getting revenue data:', error);
      throw error;
    }
  }
};