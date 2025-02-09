const Device = require('../models/Device');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// Add new device (admin only)
const addDevice = async (req, res) => {
  try {
    const { name, serialNumber, category } = req.body;
    const device = await Device.create({ name, serialNumber, category });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all devices (admin only)
const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('currentAssignment');
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all participants (admin only)
const getAllParticipants = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add participant manually (admin only)
const addParticipant = async (req, res) => {
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
};

module.exports = {
  addDevice,
  getAllDevices,
  getAllParticipants,
  addParticipant
};