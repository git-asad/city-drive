import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [{
    type: String
  }],
  response: {
    message: { type: String, trim: true, maxlength: 500 },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per car per booking
reviewSchema.index({ user: 1, car: 1, booking: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ car: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.length;
});

// Method to mark review as verified
reviewSchema.methods.verify = function() {
  this.verified = true;
  return this.save();
};

// Method to add owner response
reviewSchema.methods.addResponse = function(message, ownerId) {
  this.response = {
    message,
    respondedBy: ownerId,
    respondedAt: new Date()
  };
  return this.save();
};

// Static method to get average rating for a car
reviewSchema.statics.getAverageRating = async function(carId) {
  const result = await this.aggregate([
    { $match: { car: carId, isActive: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
  }

  const data = result[0];
  const distribution = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = data.ratingDistribution.filter(r => r === i).length;
  }

  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;