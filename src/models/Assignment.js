const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'returned'],
    default: 'active'
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);