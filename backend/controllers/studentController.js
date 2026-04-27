const Student = require('../models/Student');
const { generateToken } = require('../middleware/auth');

// @desc  Register student
// @route POST /api/students/register
const registerStudent = async (req, res) => {
  try {
    const { name, usn, email, password } = req.body;

    if (!name || !usn || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const studentExists = await Student.findOne({ $or: [{ usn }, { email }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this USN or email already exists' });
    }

    const student = await Student.create({ name, usn, email, password });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      usn: student.usn,
      email: student.email,
      role: student.role,
      profileComplete: student.profileComplete,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Login student
// @route POST /api/students/login
const loginStudent = async (req, res) => {
  try {
    const { usn, password } = req.body;

    const student = await Student.findOne({ usn: usn.toUpperCase() });
    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid USN or password' });
    }

    res.json({
      _id: student._id,
      name: student.name,
      usn: student.usn,
      email: student.email,
      role: student.role,
      profileComplete: student.profileComplete,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get student profile
// @route GET /api/students/profile/:id
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update student profile
// @route PUT /api/students/profile/:id
const updateProfile = async (req, res) => {
  try {
    const { branch, semester, cgpa, backlog, phone } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.branch = branch || student.branch;
    student.semester = semester || student.semester;
    student.cgpa = cgpa !== undefined ? cgpa : student.cgpa;
    student.backlog = backlog !== undefined ? backlog : student.backlog;
    student.phone = phone || student.phone;

    if (student.branch && student.semester && student.cgpa !== null) {
      student.profileComplete = true;
    }

    const updated = await student.save();
    res.json({ ...updated._doc, password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update preferences
// @route PUT /api/students/preferences/:id
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences || preferences.length === 0 || preferences.length > 3) {
      return res.status(400).json({ message: 'Please select 1 to 3 preferences' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!student.profileComplete) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    student.preferences = preferences;
    await student.save();

    res.json({ message: 'Preferences updated successfully', preferences: student.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get my allocation result
// @route GET /api/students/result/:id
const getMyResult = async (req, res) => {
  try {
    const Allocation = require('../models/Allocation');
    const allocation = await Allocation.findOne({ studentId: req.params.id })
      .populate('electiveId', 'electiveName faculty department code');

    if (!allocation) {
      return res.json({ status: 'Not Allocated', message: 'Allocation not yet run or no result found' });
    }

    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, getProfile, updateProfile, updatePreferences, getMyResult };