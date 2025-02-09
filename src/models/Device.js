const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance'],
    default: 'available'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', deviceSchema);