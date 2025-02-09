const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Rental = require('../models/Rental');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Get all devices
router.get('/devices', protect, async (req, res) => {
  try {
    const devices = await Device.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

// Get user's rented devices
router.get('/devices/rented', protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ 
      user: req.user._id,
      status: 'active'
    })
    .populate('device');
    
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rented devices:', error);
    res.status(500).json({ message: 'Error fetching rented devices' });
  }
});

// Rent a device
router.post('/devices/rent', protect, async (req, res) => {
  try {
    const { deviceId } = req.body;

    // Check if device exists and is available
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (device.status !== 'available') {
      return res.status(400).json({ message: 'Device is not available for rent' });
    }

    // Check if user already has active rentals for this device
    const existingRental = await Rental.findOne({
      device: deviceId,
      user: req.user._id,
      status: 'active'
    });

    if (existingRental) {
      return res.status(400).json({ message: 'You already have this device rented' });
    }

    // Create rental record
    const rental = await Rental.create({
      device: deviceId,
      user: req.user._id,
      rentalDate: new Date(),
      status: 'active'
    });

    // Update device status
    device.status = 'assigned';
    device.assignedTo = req.user._id;
    await device.save();

    // Create notification for admin
    await Notification.create({
      message: `New device rental request: ${device.name} by ${req.user.name}`,
      type: 'device_request',
      read: false,
      userId: req.user._id
    });

    res.status(201).json({ rental, device });
  } catch (error) {
    console.error('Rental error:', error);
    res.status(500).json({ message: 'Error processing rental request' });
  }
});

// Return a device
router.post('/devices/return/:id', protect, async (req, res) => {
  try {
    const rental = await Rental.findOne({
      device: req.params.id,
      user: req.user._id,
      status: 'active'
    });

    if (!rental) {
      return res.status(404).json({ message: 'Active rental not found' });
    }

    // Update rental status
    rental.status = 'returned';
    rental.returnDate = new Date();
    await rental.save();

    // Update device status
    const device = await Device.findById(req.params.id);
    device.status = 'available';
    device.assignedTo = null;
    await device.save();

    // Create notification for admin
    await Notification.create({
      message: `Device returned: ${device.name} by ${req.user.name}`,
      type: 'device_return',
      read: false,
      userId: req.user._id
    });

    res.json({ message: 'Device returned successfully', rental, device });
  } catch (error) {
    console.error('Return error:', error);
    res.status(500).json({ message: 'Error processing return request' });
  }
});

// Get user's rental history
router.get('/rentals/history', protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('device')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rental history:', error);
    res.status(500).json({ message: 'Error fetching rental history' });
  }
});

module.exports = router;