const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentLocation: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    tripTime: {
        type: String,
        default: 'now'
    },
    contactPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    fare: {
        type: Number,
        default: 0
    },
    rating: {
        passengerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        driverRating: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Trip', tripSchema);