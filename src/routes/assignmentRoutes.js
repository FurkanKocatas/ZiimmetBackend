const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Assignment = require('../models/Assignment');

// Get all assignments (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('assignedTo', 'name email')
      .populate('device', 'name serialNumber');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's assignments
router.get('/my', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ assignedTo: req.user.id })
      .populate('device', 'name serialNumber');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new assignment
router.post('/', protect, async (req, res) => {
  try {
    const { itemName, returnDate } = req.body;
    
    const newAssignment = new Assignment({
      itemName,
      assignedTo: req.user.id,
      returnDate
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return assignment
router.put('/:id/return', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Only allow the assigned user or an admin to return the item
    if (assignment.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    assignment.returnDate = new Date();
    assignment.status = 'returned';
    
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single assignment (admin or assigned user only)
router.get('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('device', 'name serialNumber');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Only allow admin or assigned user to view the assignment
    if (assignment.assignedTo._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;