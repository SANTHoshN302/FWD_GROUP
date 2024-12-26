const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    status: { type: String, enum: ['requested', 'accepted', 'completed', 'cancelled'], default: 'requested' },
    fare: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ride', rideSchema);

// Get Ride Details
router.get('/:rideId', async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await Ride.findById(rideId).populate('rider driver');
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        res.status(200).json({ ride });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Ride Status
router.patch('/:rideId/status', async (req, res) => {
    try {
        const { rideId } = req.params;
        const { status } = req.body;

        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        ride.status = status;
        await ride.save();

        res.status(200).json({ ride });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
