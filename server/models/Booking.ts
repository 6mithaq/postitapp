import mongoose from 'mongoose';

// Define the schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cruiseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cruise',
    required: true
  },
  cabinType: {
    type: String,
    required: true,
    enum: ['interior', 'oceanview', 'balcony', 'suite']
  },
  adults: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  children: {
    type: Number,
    default: 0,
    min: 0,
    max: 4
  },
  departureDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create model
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
