const mongoose = require('mongoose');

const electiveSchema = new mongoose.Schema({
  electiveName: {
    type: String,
    required: [true, 'Elective name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Elective code is required'],
    unique: true,
    uppercase: true,
  },
  faculty: {
    type: String,
    required: [true, 'Faculty name is required'],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats required'],
    min: 1,
  },
  availableSeats: {
    type: Number,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  careerTag: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  eligibleBranches: {
    type: [String],
    default: ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CV', 'AI/ML', 'DS'],
  },
  minCGPA: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Set availableSeats = totalSeats before first save
electiveSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Elective', electiveSchema);