// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Initialize app
dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Define Models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Note: In production, hash passwords with bcrypt
  type: { type: String, enum: ['rider', 'driver'], required: true }
}));

const Ride = mongoose.model('Ride', new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['requested', 'accepted', 'completed', 'cancelled'], default: 'requested' },
  pickupLocation: String,
  dropoffLocation: String,
  fare: Number,
  createdAt: { type: Date, default: Date.now }
}));

// Routes
// Home Route
app.get('/', (req, res) => res.send('Uber Clone API'));
const User = require('../uber clone/models/user');

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const user = new User({ name, email, password, type });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user', details: err.message });
  }
});

// Request Ride
const Ride = require('./models/ride');
app.post('/ride/request', async (req, res) => {
  const { riderId, pickupLocation, dropoffLocation } = req.body;
  try {
    const ride = new Ride({ riderId, pickupLocation, dropoffLocation });
    await ride.save();
    res.status(201).json({ message: 'Ride requested successfully', ride });
  } catch (err) {
    res.status(400).json({ error: 'Error requesting ride', details: err.message });
  }
});

// Accept Ride
app.post('/ride/accept', async (req, res) => {
  const { rideId, driverId } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride || ride.status !== 'requested') {
      return res.status(400).json({ error: 'Ride not available for acceptance' });
    }
    ride.driverId = driverId;
    ride.status = 'accepted';
    await ride.save();
    res.status(200).json({ message: 'Ride accepted successfully', ride });
  } catch (err) {
    res.status(400).json({ error: 'Error accepting ride', details: err.message });
  }
});

// Complete Ride
app.post('/ride/complete', async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride || ride.status !== 'accepted') {
      return res.status(400).json({ error: 'Ride not in progress' });
    }
    ride.status = 'completed';
    await ride.save();
    res.status(200).json({ message: 'Ride completed successfully', ride });
  } catch (err) {
    res.status(400).json({ error: 'Error completing ride', details: err.message });
  }
});

// Cancel Ride
app.post('/ride/cancel', async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    if (!ride || ride.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel ride' });
    }
    ride.status = 'cancelled';
    await ride.save();
    res.status(200).json({ message: 'Ride cancelled successfully', ride });
  } catch (err) {
    res.status(400).json({ error: 'Error cancelling ride', details: err.message });
  }
});

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Driver shares their live location
  socket.on('updateLocation', (data) => {
      const { driverId, latitude, longitude } = data;
      console.log(`Location update from driver ${driverId}: ${latitude}, ${longitude}`);

      // Broadcast location to all riders (or specific rider)
      socket.broadcast.emit('driverLocationUpdate', { driverId, latitude, longitude });
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

