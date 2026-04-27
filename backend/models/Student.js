const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  usn: {
    type: String,
    required: [true, 'USN is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  branch: {
    type: String,
    enum: {
      values: ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CV', 'AI/ML', 'DS'],
      message: 'Invalid branch'
    },
    default: undefined,
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    default: undefined,
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: undefined,
  },
  backlog: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: null,
  },
  preferences: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 3,
      message: 'Maximum 3 preferences allowed',
    },
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'student',
  },
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);