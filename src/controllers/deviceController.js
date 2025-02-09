const Device = require('../models/Device');
const Assignment = require('../models/Assignment');

// Get available devices (for users)
const getAvailableDevices = async (req, res) => {
  try {
    const devices = await Device.find({ status: 'available' });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request device assignment (for users)
const requestDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const userId = req.user.id; // From auth middleware

    const device = await Device.findById(deviceId);
    if (!device || device.status !== 'available') {
      return res.status(400).json({ message: 'Device not available' });
    }

    const assignment = await Assignment.create({
      device: deviceId,
      assignedTo: userId,
      assignedBy: userId // In this case, self-assigned
    });

    device.status = 'assigned';
    device.currentAssignment = assignment._id;
    await device.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return device (for users)
const returnDevice = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const userId = req.user.id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      assignedTo: userId,
      status: 'active'
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'returned';
    assignment.returnDate = new Date();
    await assignment.save();

    const device = await Device.findById(assignment.device);
    device.status = 'available';
    device.currentAssignment = null;
    await device.save();

    res.status(200).json({ message: 'Device returned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableDevices,
  requestDevice,
  returnDevice
};