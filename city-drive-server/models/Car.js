import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  category: {
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Luxury', 'Sports'],
    trim: true
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  seating_capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  fuel_type: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    trim: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Manual', 'Automatic', 'CVT'],
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  mileage: {
    type: Number,
    min: 0
  },
  color: {
    type: String,
    trim: true
  },
  licensePlate: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search
carSchema.index({
  brand: 'text',
  model: 'text',
  category: 'text',
  location: 'text'
});

// Virtual for full name
carSchema.virtual('fullName').get(function() {
  return `${this.brand} ${this.model}`;
});

// Update average rating method
carSchema.methods.updateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { car: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    this.averageRating = Math.round(result[0].averageRating * 10) / 10;
    this.reviewCount = result[0].reviewCount;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }

  await this.save();
};

const Car = mongoose.model('Car', carSchema);

export default Car;