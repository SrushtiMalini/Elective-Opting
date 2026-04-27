const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  electiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elective',
    required: true,
  },
  assignedElective: {
    type: String,
    required: true,
  },
  preferenceRank: {
    type: Number, // 1, 2, or 3 — which preference got allocated
  },
  status: {
    type: String,
    enum: ['Approved', 'Waitlisted', 'Rejected', 'Pending'],
    default: 'Pending',
  },
  waitlistPosition: {
    type: Number,
    default: null,
  },
  allocationRound: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

module.exports = mongoose.model('Allocation', allocationSchema);