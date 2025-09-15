import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['general', 'booking', 'technical', 'billing', 'complaint', 'suggestion'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'open', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responses: [{
    message: { type: String, required: true },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],
  attachments: [{
    filename: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  resolvedAt: {
    type: Date
  },
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ user: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ category: 1 });

// Method to add response
contactSchema.methods.addResponse = function(message, userId, isInternal = false) {
  this.responses.push({
    message,
    respondedBy: userId,
    isInternal
  });

  // Update status if it's new
  if (this.status === 'new') {
    this.status = 'open';
  }

  return this.save();
};

// Method to resolve ticket
contactSchema.methods.resolve = function() {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  return this.save();
};

// Method to close ticket
contactSchema.methods.close = function() {
  this.status = 'closed';
  return this.save();
};

// Static method to get tickets by status
contactSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;