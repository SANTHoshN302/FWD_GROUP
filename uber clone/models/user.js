// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password should be hashed in production
  phone: { type: String, required: true },
  type: { type: String, enum: ['rider', 'driver'], required: true },
  location: { type: { lat: Number, lng: Number }, required: false }, // For driver's live location
  isAvailable: { type: Boolean, default: true }, // Relevant for drivers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
