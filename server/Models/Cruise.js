import mongoose from 'mongoose';

// Define the schema
const cruiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  departureLocation: {
    type: String,
    required: true
  },
  destinationLocation: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxesFees: {
    type: Number,
    required: true,
    min: 0
  },
  gratuities: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  departureOptions: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model
const Cruise = mongoose.model('Cruise', cruiseSchema);

export default Cruise;
