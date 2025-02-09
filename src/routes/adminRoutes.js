const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Device = require('../models/Device');
const User = require('../models/User');

// Get all devices
router.get('/devices', protect, adminOnly, async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new device
router.post('/devices', protect, adminOnly, async (req, res) => {
  try {
    const { name, serialNumber, category } = req.body;
    const device = await Device.create({
      name,
      serialNumber,
      category
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all participants
router.get('/participants', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add participant manually
router.post('/participants', protect, adminOnly, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
      role: 'user',
      approved: true
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle user approval
router.put('/participants/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.approved = !user.approved;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;