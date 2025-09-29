const express = require('express');
const Trip = require('../models/Trip');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Request a trip (passenger)
router.post('/request', [
    auth,
    body('currentLocation').notEmpty(),
    body('destination').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentLocation, destination, tripTime, contactPhone } = req.body;

        const trip = new Trip({
            passengerId: req.user.id,
            currentLocation,
            destination,
            tripTime,
            contactPhone,
            status: 'pending'
        });

        await trip.save();

        res.json({
            success: true,
            trip: trip
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Search for passengers (driver)
router.post('/search', auth, async (req, res) => {
    try {
        const { startLocation, destination, timeFilter, governorateFilter } = req.body;

        let query = { status: 'pending' };

        if (startLocation) query.currentLocation = { $regex: startLocation, $options: 'i' };
        if (destination) query.destination = { $regex: destination, $options: 'i' };

        const trips = await Trip.find(query).populate('passengerId', 'name phone email');

        res.json({
            success: true,
            passengers: trips.map(trip => ({
                id: trip._id,
                passengerName: trip.passengerId.name,
                currentLocation: trip.currentLocation,
                destination: trip.destination,
                tripTime: trip.tripTime,
                contactPhone: trip.contactPhone,
                status: trip.status
            }))
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Accept a passenger (driver)
router.put('/accept/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'accepted',
                driverId: req.user.id
            },
            { new: true }
        ).populate('passengerId', 'name phone email');

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        res.json({
            success: true,
            trip: trip
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Complete a trip
router.put('/complete/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        res.json({
            success: true,
            trip: trip
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get passenger trips
router.get('/passenger/:id', auth, async (req, res) => {
    try {
        const trips = await Trip.find({ passengerId: req.params.id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            requests: trips
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get driver trips
router.get('/driver/:id', auth, async (req, res) => {
    try {
        const trips = await Trip.find({ driverId: req.params.id }).populate('passengerId', 'name phone email').sort({ createdAt: -1 });

        res.json({
            success: true,
            trips: trips.map(trip => ({
                id: trip._id,
                passengerName: trip.passengerId.name,
                currentLocation: trip.currentLocation,
                destination: trip.destination,
                contactPhone: trip.contactPhone,
                status: trip.status
            }))
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get available trips
router.get('/available', auth, async (req, res) => {
    try {
        const trips = await Trip.find({ status: 'pending' }).populate('passengerId', 'name phone email');

        res.json({
            success: true,
            passengers: trips.map(trip => ({
                id: trip._id,
                passengerName: trip.passengerId.name,
                currentLocation: trip.currentLocation,
                destination: trip.destination,
                tripTime: trip.tripTime,
                contactPhone: trip.contactPhone,
                status: trip.status
            }))
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;