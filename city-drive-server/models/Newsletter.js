import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  preferences: {
    cars: { type: Boolean, default: true },
    deals: { type: Boolean, default: true },
    news: { type: Boolean, default: false },
    locations: [{ type: String, trim: true }]
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  subscriptionSource: {
    type: String,
    enum: ['website', 'booking', 'referral', 'admin'],
    default: 'website'
  },
  unsubscribedAt: {
    type: Date
  },
  unsubscribeReason: {
    type: String,
    trim: true
  },
  lastEmailSent: {
    type: Date
  },
  emailCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
newsletterSchema.index({ subscriptionStatus: 1 });
newsletterSchema.index({ createdAt: -1 });

// Method to unsubscribe
newsletterSchema.methods.unsubscribe = function(reason = '') {
  this.subscriptionStatus = 'unsubscribed';
  this.unsubscribedAt = new Date();
  this.unsubscribeReason = reason;
  return this.save();
};

// Method to resubscribe
newsletterSchema.methods.resubscribe = function() {
  this.subscriptionStatus = 'active';
  this.unsubscribedAt = undefined;
  this.unsubscribeReason = '';
  return this.save();
};

// Static method to get active subscribers
newsletterSchema.statics.getActiveSubscribers = function() {
  return this.find({ subscriptionStatus: 'active' });
};

// Static method to get subscribers by preference
newsletterSchema.statics.getSubscribersByPreference = function(preference) {
  return this.find({
    subscriptionStatus: 'active',
    [`preferences.${preference}`]: true
  });
};

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;