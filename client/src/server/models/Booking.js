import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  returnLocation: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  costBreakdown: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deposit: { type: Number, required: true },
    insurance: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  insurance: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  driverInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, trim: true },
    dateOfBirth: { type: Date }
  },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true }
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  notes: [{
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ car: 1, pickupDate: 1 });
bookingSchema.index({ status: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  return this.days;
});

// Pre-save middleware to calculate days
bookingSchema.pre('save', function(next) {
  if (this.isModified('pickupDate') || this.isModified('returnDate')) {
    const pickup = new Date(this.pickupDate);
    const returnD = new Date(this.returnDate);
    this.days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canCancel = function() {
  const now = new Date();
  const pickup = new Date(this.pickupDate);
  const hoursUntilPickup = (pickup - now) / (1000 * 60 * 60);

  // Can cancel if more than 24 hours before pickup and not already active/completed
  return hoursUntilPickup > 24 &&
         !['active', 'completed', 'cancelled'].includes(this.status);
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canCancel()) return 0;

  const now = new Date();
  const pickup = new Date(this.pickupDate);
  const hoursUntilPickup = (pickup - now) / (1000 * 60 * 60);

  // Full refund if more than 48 hours, 50% if 24-48 hours
  if (hoursUntilPickup > 48) {
    return this.totalCost;
  } else if (hoursUntilPickup > 24) {
    return Math.round(this.totalCost * 0.5 * 100) / 100;
  }

  return 0;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;