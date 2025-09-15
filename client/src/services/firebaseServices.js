// Firebase services for City Drive
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Car Services
export const carServices = {
  // Get all available cars
  async getAllCars() {
    try {
      const carsRef = collection(db, 'cars');
      const q = query(carsRef, where('available', '==', true));
      const querySnapshot = await getDocs(q);

      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ Retrieved ${cars.length} available cars`);
      return cars;
    } catch (error) {
      console.error('❌ Error fetching cars:', error);
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
      console.error('❌ Error fetching car:', error);
      throw error;
    }
  },

  // Get owner's cars
  async getOwnerCars(ownerId) {
    try {
      const carsRef = collection(db, 'cars');
      const q = query(carsRef, where('ownerId', '==', ownerId));
      const querySnapshot = await getDocs(q);

      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ Retrieved ${cars.length} owner cars`);
      return cars;
    } catch (error) {
      console.error('❌ Error fetching owner cars:', error);
      throw error;
    }
  },

  // Add new car
  async addCar(carData, ownerId) {
    try {
      const carDoc = {
        ...carData,
        ownerId: ownerId,
        available: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'cars'), carDoc);
      console.log('✅ Car added with ID:', docRef.id);
      return { id: docRef.id, ...carDoc };
    } catch (error) {
      console.error('❌ Error adding car:', error);
      throw error;
    }
  },

  // Update car
  async updateCar(carId, carData) {
    try {
      const carRef = doc(db, 'cars', carId);
      await updateDoc(carRef, {
        ...carData,
        updatedAt: Timestamp.now()
      });

      console.log('✅ Car updated:', carId);
      return { id: carId, ...carData };
    } catch (error) {
      console.error('❌ Error updating car:', error);
      throw error;
    }
  },

  // Delete car
  async deleteCar(carId) {
    try {
      await deleteDoc(doc(db, 'cars', carId));
      console.log('✅ Car deleted:', carId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting car:', error);
      throw error;
    }
  }
};

// Booking Services
export const bookingServices = {
  // Get user's bookings
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
        const data = doc.data();
        bookings.push({
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate?.() || data.startDate,
          endDate: data.endDate?.toDate?.() || data.endDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

      console.log(`✅ Retrieved ${bookings.length} user bookings`);
      return bookings;
    } catch (error) {
      console.error('❌ Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get all bookings (for owners)
  async getAllBookings() {
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));

      const bookings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate?.() || data.startDate,
          endDate: data.endDate?.toDate?.() || data.endDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

      console.log(`✅ Retrieved ${bookings.length} bookings`);
      return bookings;
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      throw error;
    }
  },

  // Create booking
  async createBooking(bookingData, userId) {
    try {
      // Get car details to calculate price
      const car = await carServices.getCarById(bookingData.carId);
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalPrice = days * car.pricePerDay;

      const bookingDoc = {
        userId: userId,
        carId: bookingData.carId,
        carName: `${car.name} ${car.model}`,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);
      console.log('✅ Booking created with ID:', docRef.id);

      return {
        id: docRef.id,
        ...bookingDoc,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: status,
        updatedAt: Timestamp.now()
      });

      console.log(`✅ Booking ${bookingId} status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
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
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const reviews = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

      console.log(`✅ Retrieved ${reviews.length} reviews for car ${carId}`);
      return reviews;
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
    }
  },

  // Add review
  async addReview(reviewData, userId) {
    try {
      const reviewDoc = {
        ...reviewData,
        userId: userId,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewDoc);
      console.log('✅ Review added with ID:', docRef.id);
      return { id: docRef.id, ...reviewDoc };
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  }
};