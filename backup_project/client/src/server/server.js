import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Import models
import User from './models/User.js';
import Car from './models/Car.js';
import Booking from './models/Booking.js';
import Review from './models/Review.js';
import Newsletter from './models/Newsletter.js';
import Contact from './models/Contact.js';

// initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citydrive')
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Server will continue without database connection. Some features may not work.');
});

// Google OAuth Client
const client = new OAuth2Client("572140120355-v14qb7j31oqjmacba895uho0a2jouiqt.apps.googleusercontent.com");

// Secret for your JWT (keep it private)
const JWT_SECRET = "super_secret_key";

// Stripe Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here');

// Email Configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Twilio Configuration (optional)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    !process.env.TWILIO_ACCOUNT_SID.includes('your_twilio') &&
    !process.env.TWILIO_AUTH_TOKEN.includes('your_twilio')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Payment Calculation Function
const calculateTotalCost = (basePrice, days, insurance = false) => {
  const subtotal = basePrice * days;
  const taxRate = 0.08; // 8% tax
  const deposit = Math.min(basePrice * 0.5, 500); // 50% of daily rate or max $500
  const insuranceCost = insurance ? days * 15 : 0; // $15 per day for insurance

  const tax = (subtotal + insuranceCost) * taxRate;
  const total = subtotal + tax + deposit + insuranceCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    deposit: Math.round(deposit * 100) / 100,
    insurance: Math.round(insuranceCost * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

// Email Notification Function
const sendConfirmationEmail = async (bookingData, paymentData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: bookingData.email,
    subject: 'Booking Confirmation - City Drive',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Dear ${bookingData.firstName} ${bookingData.lastName},</p>
        <p>Your car rental booking has been confirmed. Here are the details:</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Car:</strong> ${bookingData.car.brand} ${bookingData.car.model}</p>
          <p><strong>Pickup:</strong> ${bookingData.pickupDate} at ${bookingData.pickupLocation}</p>
          <p><strong>Return:</strong> ${bookingData.returnDate}</p>
          <p><strong>Duration:</strong> ${bookingData.days} days</p>
          <p><strong>Total Amount:</strong> $${bookingData.totalCost}</p>
          <p><strong>Payment ID:</strong> ${paymentData.paymentIntentId}</p>
        </div>

        <p>Thank you for choosing City Drive!</p>
        <p>Best regards,<br>City Drive Team</p>
      </div>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// SMS Notification Function
const sendConfirmationSMS = async (phoneNumber, bookingData) => {
  try {
    await twilioClient.messages.create({
      body: `City Drive: Your booking for ${bookingData.car.brand} ${bookingData.car.model} is confirmed. Total: $${bookingData.totalCost}. Pickup: ${bookingData.pickupDate}`,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: phoneNumber
    });
    console.log('Confirmation SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Authentication Routes

// Register User
app.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database service unavailable. Please try again later.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// Login User
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database service unavailable. Please try again later.'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Get User Profile
app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database service unavailable. Please try again later.'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// Update User Profile
app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database service unavailable. Please try again later.'
      });
    }

    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Create Payment Intent
app.post('/create-payment', async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, insurance, email } = req.body;

    // Get car details from database
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    if (!car.isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Car is not available'
      });
    }

    // Calculate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date range'
      });
    }

    const costBreakdown = calculateTotalCost(car.pricePerDay, days, insurance);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(costBreakdown.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        carId,
        pickupDate,
        returnDate,
        insurance: insurance ? 'yes' : 'no',
        email,
        days: days.toString()
      },
      receipt_email: email
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      costBreakdown,
      days,
      car: {
        _id: car._id,
        brand: car.brand,
        model: car.model,
        pricePerDay: car.pricePerDay
      }
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
});

// Confirm Payment and Create Booking
app.post('/confirm-payment', async (req, res) => {
  try {
    const {
      paymentIntentId,
      bookingData,
      costBreakdown
    } = req.body;

    // Verify payment status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    // Check if booking already exists
    const existingBooking = await Booking.findOne({ paymentIntentId });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Booking already exists'
      });
    }

    // Create booking record (without user authentication for demo purposes)
    const booking = new Booking({
      user: null, // No user for anonymous bookings
      car: bookingData.carId,
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      pickupLocation: bookingData.pickupLocation,
      returnLocation: bookingData.returnLocation,
      days: bookingData.days,
      totalCost: costBreakdown.total,
      costBreakdown,
      insurance: bookingData.insurance,
      paymentIntentId,
      paymentStatus: 'paid',
      driverInfo: bookingData.driverInfo,
      emergencyContact: bookingData.emergencyContact,
      specialRequests: bookingData.specialRequests
    });

    await booking.save();

    // Populate booking with car details for email
    await booking.populate([
      { path: 'car', select: 'brand model' }
    ]);

    // Send confirmation email
    await sendConfirmationEmail(booking, { paymentIntentId });

    // Send confirmation SMS
    if (booking.driverInfo.phone) {
      await sendConfirmationSMS(booking.driverInfo.phone, booking);
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        ...booking.toObject()
      },
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm booking'
    });
  }
});

// Mock bookings data for when database is not available
const mockBookings = [
  {
    _id: '1',
    car: {
      brand: 'BMW',
      model: 'X5',
      images: ['/src/assets/bmw_new.png'],
      pricePerDay: 85
    },
    pickupDate: '2025-01-15',
    returnDate: '2025-01-18',
    pickupLocation: 'New York',
    status: 'confirmed',
    totalCost: 340,
    days: 3,
    createdAt: '2025-01-10T10:00:00Z',
    driverInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }
  },
  {
    _id: '2',
    car: {
      brand: 'Mercedes',
      model: 'C-Class',
      images: ['/src/assets/car_image1.png'],
      pricePerDay: 75
    },
    pickupDate: '2025-01-20',
    returnDate: '2025-01-22',
    pickupLocation: 'Los Angeles',
    status: 'pending',
    totalCost: 150,
    days: 2,
    createdAt: '2025-01-12T14:30:00Z',
    driverInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+1234567891'
    }
  }
];

// Get User Bookings
app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data when database is not available
      let filteredBookings = [...mockBookings];

      if (status) {
        filteredBookings = filteredBookings.filter(booking => booking.status === status);
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

      return res.json({
        success: true,
        bookings: paginatedBookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredBookings.length / limit),
          totalBookings: filteredBookings.length
        }
      });
    }

    let query = { user: req.user.userId };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('car', 'brand model images pricePerDay')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Get All Bookings (Admin only)
app.get('/admin/bookings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('car', 'brand model pricePerDay')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Update booking status (Admin only)
app.put('/admin/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    booking.status = status;
    if (notes) {
      booking.notes.push({
        message: notes,
        createdBy: req.user.userId
      });
    }

    if (status === 'completed') {
      booking.completedAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

// Review System Routes

// Get reviews for a car
app.get('/cars/:carId/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'highest') sortOptions = { rating: -1 };
    if (sort === 'lowest') sortOptions = { rating: 1 };

    const reviews = await Review.find({
      car: req.params.carId,
      isActive: true
    })
    .populate('user', 'firstName lastName profileImage')
    .populate('booking', 'pickupDate returnDate')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Review.countDocuments({
      car: req.params.carId,
      isActive: true
    });

    // Get rating statistics
    const stats = await Review.getAverageRating(req.params.carId);

    res.json({
      success: true,
      reviews,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// Add a review
app.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const { carId, bookingId, rating, title, comment, pros, cons } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.userId,
      car: carId,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking or booking not completed'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.userId,
      car: carId,
      booking: bookingId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Review already exists for this booking'
      });
    }

    const review = new Review({
      user: req.user.userId,
      car: carId,
      booking: bookingId,
      rating,
      title,
      comment,
      pros,
      cons,
      verified: true
    });

    await review.save();

    // Update car's average rating
    await review.populate('car');
    await review.car.updateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
});

// Update a review
app.put('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    const { rating, title, comment, pros, cons } = req.body;

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.pros = pros;
    review.cons = cons;

    await review.save();

    // Update car's average rating
    await review.populate('car');
    await review.car.updateAverageRating();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review'
    });
  }
});

// Delete a review
app.delete('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (review.user.toString() !== req.user.userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update car's average rating
    await review.populate('car');
    await review.car.updateAverageRating();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
});

// Mark review as helpful
app.post('/reviews/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const userId = req.user.userId;
    const helpfulIndex = review.helpful.indexOf(userId);

    if (helpfulIndex > -1) {
      // Remove helpful vote
      review.helpful.splice(helpfulIndex, 1);
    } else {
      // Add helpful vote
      review.helpful.push(userId);
    }

    await review.save();

    res.json({
      success: true,
      helpfulCount: review.helpful.length,
      isHelpful: helpfulIndex === -1
    });

  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark review helpful'
    });
  }
});

// Google Authentication Endpoint
app.post("/auth/google", async (req, res) => {
  const token = req.body.token; // ID token from frontend

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database service unavailable. Please try again later.'
      });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "572140120355-v14qb7j31oqjmacba895uho0a2jouiqt.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();

    // Check if user exists, if not create one
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      // Try to find by email
      user = await User.findOne({ email: payload.email });
      if (user) {
        // Link Google account
        user.googleId = payload.sub;
        await user.save();
      } else {
        // Create new user
        const nameParts = payload.name.split(' ');
        user = new User({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: payload.email,
          googleId: payload.sub,
          profileImage: payload.picture,
          password: Math.random().toString(36) // Random password for Google users
        });
        await user.save();
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send user info + session token back
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
      token: sessionToken,
    });

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ success: false, error: "Invalid Google token" });
  }
});

// Logout (client-side token removal, but we can track it server-side if needed)
app.post('/auth/logout', authenticateToken, async (req, res) => {
  // In a real implementation, you might want to blacklist the token
  // For now, just return success
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Car Management Routes

// Mock car data for when database is not available - Only the 4 featured cars
const mockCars = [
  {
    _id: '67ff5bc069c03d4e45f30b77',
    brand: 'BMW',
    model: 'X5',
    year: 2006,
    category: 'SUV',
    pricePerDay: 300,
    seating_capacity: 4,
    fuel_type: 'Hybrid',
    transmission: 'Semi-Automatic',
    location: 'New York',
    images: ['/src/assets/car_image1.png'],
    features: ['GPS', 'Bluetooth', 'Air Conditioning'],
    description: 'The BMW X5 is a mid-size luxury SUV produced by BMW. The X5 made its debut in 1999 as the first SUV ever produced by BMW.',
    isAvailable: true,
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    _id: '67ff6b758f1b3684286a2a65',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    category: 'Sedan',
    pricePerDay: 130,
    seating_capacity: 4,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    location: 'Chicago',
    images: ['/src/assets/car_image2.png'],
    features: ['GPS', 'Bluetooth', 'Backup Camera'],
    description: 'The Toyota Corolla is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.',
    isAvailable: true,
    averageRating: 4.0,
    reviewCount: 20
  },
  {
    _id: '67ff6b9f8f1b3684286a2a68',
    brand: 'Jeep',
    model: 'Wrangler',
    year: 2023,
    category: 'SUV',
    pricePerDay: 200,
    seating_capacity: 4,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    location: 'Los Angeles',
    images: ['/src/assets/car_image3.png'],
    features: ['4WD', 'Removable Doors', 'GPS'],
    description: 'The Jeep Wrangler is a mid-size luxury SUV produced by Jeep. The Wrangler made its debut in 2003 as the first SUV ever produced by Jeep.',
    isAvailable: true,
    averageRating: 4.4,
    reviewCount: 16
  },
  {
    _id: '68009c93a3f5fc6338ea7e34',
    brand: 'Ford',
    model: 'Neo 6',
    year: 2022,
    category: 'Sedan',
    pricePerDay: 209,
    seating_capacity: 2,
    fuel_type: 'Diesel',
    transmission: 'Semi-Automatic',
    location: 'Houston',
    images: ['/src/assets/car_image4.png'],
    features: ['GPS', 'Bluetooth', 'Apple CarPlay'],
    description: 'This is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.',
    isAvailable: true,
    averageRating: 4.2,
    reviewCount: 11
  }
];

// Get all cars with filtering and search
app.get('/cars', async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data when database is not available
      let filteredCars = [...mockCars];

      // Apply filters
      if (search) {
        filteredCars = filteredCars.filter(car =>
          car.brand.toLowerCase().includes(search.toLowerCase()) ||
          car.model.toLowerCase().includes(search.toLowerCase()) ||
          car.category.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category) {
        filteredCars = filteredCars.filter(car => car.category === category);
      }

      if (location) {
        filteredCars = filteredCars.filter(car => car.location === location);
      }

      if (minPrice || maxPrice) {
        filteredCars = filteredCars.filter(car => {
          const price = car.pricePerDay;
          if (minPrice && price < parseFloat(minPrice)) return false;
          if (maxPrice && price > parseFloat(maxPrice)) return false;
          return true;
        });
      }

      // Apply sorting
      filteredCars.sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case 'pricePerDay':
            aValue = a.pricePerDay;
            bValue = b.pricePerDay;
            break;
          case 'year':
            aValue = a.year;
            bValue = b.year;
            break;
          default:
            return 0;
        }
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCars = filteredCars.slice(startIndex, endIndex);

      return res.json({
        success: true,
        cars: paginatedCars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredCars.length / limit),
          totalCars: filteredCars.length,
          hasNext: endIndex < filteredCars.length,
          hasPrev: page > 1
        }
      });
    }

    let query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (location) query.location = location;
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseFloat(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const cars = await Car.find(query)
      .populate('owner', 'firstName lastName email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Car.countDocuments(query);

    res.json({
      success: true,
      cars,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCars: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cars'
    });
  }
});

// Get car by ID
app.get('/cars/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data when database is not available
      const car = mockCars.find(c => c._id === req.params.id);
      if (!car) {
        return res.status(404).json({
          success: false,
          error: 'Car not found'
        });
      }

      return res.json({
        success: true,
        car,
        reviews: []
      });
    }

    const car = await Car.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone')
      .lean();

    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    // Get reviews for this car
    const reviews = await Review.find({ car: req.params.id, isActive: true })
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      car,
      reviews
    });

  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch car'
    });
  }
});

// Add new car (owner only)
app.post('/cars', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Only owners can add cars'
      });
    }

    const carData = {
      ...req.body,
      owner: req.user.userId
    };

    const car = new Car(carData);
    await car.save();

    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      car
    });

  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add car'
    });
  }
});

// Update car (owner or admin only)
app.put('/cars/:id', authenticateToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'admin' && car.owner.toString() !== req.user.userId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this car'
      });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Car updated successfully',
      car: updatedCar
    });

  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update car'
    });
  }
});

// Delete car (owner or admin only)
app.delete('/cars/:id', authenticateToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'admin' && car.owner.toString() !== req.user.userId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this car'
      });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });

  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete car'
    });
  }
});

// Get owner's cars
app.get('/owner/cars', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const cars = await Car.find({ owner: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      cars
    });

  } catch (error) {
    console.error('Get owner cars error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cars'
    });
  }
});

// Newsletter Routes

// Subscribe to newsletter
app.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName, preferences } = req.body;

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.subscriptionStatus === 'active') {
        return res.status(400).json({
          success: false,
          error: 'Email already subscribed'
        });
      } else {
        // Resubscribe
        await subscriber.resubscribe();
        subscriber.firstName = firstName;
        subscriber.lastName = lastName;
        subscriber.preferences = preferences;
        await subscriber.save();
      }
    } else {
      subscriber = new Newsletter({
        email,
        firstName,
        lastName,
        preferences,
        subscriptionSource: 'website'
      });
      await subscriber.save();
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        email: subscriber.email,
        status: subscriber.subscriptionStatus
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter'
    });
  }
});

// Unsubscribe from newsletter
app.post('/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email, reason } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in newsletter list'
      });
    }

    await subscriber.unsubscribe(reason);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe from newsletter'
    });
  }
});

// Contact/Support Routes

// Submit contact form
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category,
      user: req.user ? req.user.userId : null
    });

    await contact.save();

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Contact Form Received - City Drive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting City Drive</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <p>Best regards,<br>City Drive Support Team</p>
        </div>
      `
    };

    try {
      await emailTransporter.sendMail(userMailOptions);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      ticketId: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Get user's contact tickets
app.get('/contact', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.userId };
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalContacts: total
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact tickets'
    });
  }
});

// Get all contact tickets (Admin only)
app.get('/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { status, category, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const contacts = await Contact.find(query)
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalContacts: total
      }
    });

  } catch (error) {
    console.error('Error fetching admin contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact tickets'
    });
  }
});

// Update contact ticket status (Admin only)
app.put('/admin/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { status, response, assignedTo } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact ticket not found'
      });
    }

    if (status) contact.status = status;
    if (assignedTo) contact.assignedTo = assignedTo;

    if (response) {
      await contact.addResponse(response, req.user.userId, true);
    }

    if (status === 'resolved') {
      await contact.resolve();
    } else if (status === 'closed') {
      await contact.close();
    }

    await contact.save();

    res.json({
      success: true,
      message: 'Contact ticket updated successfully',
      contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact ticket'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});