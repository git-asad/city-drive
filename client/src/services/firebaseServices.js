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
      const q = query(carsRef, where('availability', '==', true), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

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
      const q = query(carsRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

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
        name: carData.name,
        brand: carData.brand,
        model: carData.model,
        description: carData.description,
        pricePerDay: carData.pricePerDay,
        availability: true,
        imageURL: carData.imageURL,
        ownerId: ownerId,
        category: carData.category,
        year: carData.year,
        seatingCapacity: carData.seatingCapacity,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        location: carData.location,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'cars'), carDoc);
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
        where('clientId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const bookings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          ...data,
          pickupDate: data.pickupDate?.toDate?.() || data.pickupDate,
          returnDate: data.returnDate?.toDate?.() || data.returnDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

      return bookings;
    } catch (error) {
      console.error('❌ Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get all bookings (for owners)
  async getAllBookings() {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const bookings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookings.push({
          id: doc.id,
          ...data,
          pickupDate: data.pickupDate?.toDate?.() || data.pickupDate,
          returnDate: data.returnDate?.toDate?.() || data.returnDate,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

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
      const startDate = new Date(bookingData.pickupDate);
      const endDate = new Date(bookingData.returnDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalPrice = days * car.pricePerDay;

      const bookingDoc = {
        clientId: userId,
        carId: bookingData.carId,
        pickupDate: Timestamp.fromDate(startDate),
        returnDate: Timestamp.fromDate(endDate),
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);

      return {
        id: docRef.id,
        ...bookingDoc,
        pickupDate: startDate,
        returnDate: endDate,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status, ownerId = null) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const updateData = {
        status: status,
        updatedAt: Timestamp.now()
      };

      // If accepting booking, add acceptedAt timestamp
      if (status === 'confirmed') {
        updateData.acceptedAt = Timestamp.now();
      }

      await updateDoc(bookingRef, updateData);

      // If booking is accepted and we have ownerId, create revenue record
      if (status === 'confirmed' && ownerId) {
        try {
          // Get the booking details to create revenue record
          const bookingDoc = await getDoc(bookingRef);
          if (bookingDoc.exists()) {
            const bookingData = { id: bookingDoc.id, ...bookingDoc.data() };
            await revenueServices.createRevenueRecord(bookingData, ownerId);
            console.log('💰 Revenue record created for accepted booking');
          }
        } catch (revenueError) {
          console.error('❌ Error creating revenue record:', revenueError);
          // Don't fail the booking update if revenue creation fails
        }
      }

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
      return { id: docRef.id, ...reviewDoc };
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  }
};

// Revenue Services
export const revenueServices = {
  // Get owner's revenue records
  async getOwnerRevenue(ownerId) {
    try {
      const revenueRef = collection(db, 'revenue');
      const q = query(revenueRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const revenues = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        revenues.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });

      return revenues;
    } catch (error) {
      console.error('❌ Error fetching owner revenue:', error);
      throw error;
    }
  },

  // Create revenue record when booking is accepted
  async createRevenueRecord(bookingData, ownerId) {
    try {
      const revenueDoc = {
        ownerId: ownerId,
        bookingId: bookingData.id,
        carId: bookingData.carId,
        clientId: bookingData.clientId,
        amount: bookingData.totalPrice,
        description: `Revenue from booking: ${bookingData.carName || 'Car rental'}`,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'revenue'), revenueDoc);
      return { id: docRef.id, ...revenueDoc };
    } catch (error) {
      console.error('❌ Error creating revenue record:', error);
      throw error;
    }
  },

  // Get total revenue for owner
  async getTotalRevenue(ownerId) {
    try {
      const revenues = await this.getOwnerRevenue(ownerId);
      return revenues.reduce((total, revenue) => total + (revenue.amount || 0), 0);
    } catch (error) {
      console.error('❌ Error calculating total revenue:', error);
      throw error;
    }
  }
};