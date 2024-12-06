// models/Ride.js
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pickupLocation: { type: { lat: Number, lng: Number }, required: true },
  dropoffLocation: { type: { lat: Number, lng: Number }, required: true },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'], 
    default: 'requested' 
  },
  fare: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Ride', rideSchema);
