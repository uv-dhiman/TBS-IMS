// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  totalFee: {
    type: Number,
    required: true
  },
  paidFee: {
    type: Number,
    default: 0
  },
  admissionDate: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to calculate pending dues automatically
studentSchema.virtual('pendingFee').get(function() {
  return this.totalFee - this.paidFee;
});

module.exports = mongoose.model('Student', studentSchema);