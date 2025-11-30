// models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Record must have a name'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Record must have a value'],
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);