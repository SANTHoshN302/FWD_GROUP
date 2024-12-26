const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    make: String,
    model: String,
    licensePlate: String,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
