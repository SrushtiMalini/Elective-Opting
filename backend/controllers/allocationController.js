const Student = require('../models/Student');
const Elective = require('../models/Elective');
const Allocation = require('../models/Allocation');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// =============================================
// PRIORITY ALLOCATION ENGINE (Core Logic)
// =============================================
// Rules:
// 1. Sort students by CGPA descending (higher CGPA = higher priority)
// 2. No backlog preferred (students with backlog processed after clean students)
// 3. Branch eligibility checked
// 4. Preference order respected (Pref 1 → 2 → 3)
// 5. Seat availability checked
// 6. Remaining students → waitlisted

const runAllocationEngine = async (req, res) => {
  try {
    // Clear previous allocations
    await Allocation.deleteMany({});

    // Reset seat counts
    const electives = await Elective.find({ isActive: true });
    for (const elective of electives) {
      elective.availableSeats = elective.totalSeats;
      await elective.save();
    }

    // Fetch students who submitted preferences
    const students = await Student.find({
      profileComplete: true,
      preferences: { $exists: true, $not: { $size: 0 } },
    });

    // Sort: no-backlog first, then by CGPA descending
    const sorted = students.sort((a, b) => {
      if (a.backlog !== b.backlog) return a.backlog ? 1 : -1; // backlog = lower priority
      return b.cgpa - a.cgpa; // higher CGPA first
    });

    // Track seat map for quick lookup
    const seatMap = {};
    const waitlistCountMap = {};
    electives.forEach((e) => {
      seatMap[e._id.toString()] = e.availableSeats;
      waitlistCountMap[e._id.toString()] = 0;
    });

    const allocations = [];

    for (const student of sorted) {
      let allocated = false;

      for (let i = 0; i < student.preferences.length; i++) {
        const prefName = student.preferences[i];

        // Find elective by name
        const elective = electives.find(
          (e) => e.electiveName === prefName && e.isActive
        );
        if (!elective) continue;

        const eId = elective._id.toString();

        // Check branch eligibility
        if (!elective.eligibleBranches.includes(student.branch)) continue;

        // Check min CGPA
        if (student.cgpa < elective.minCGPA) continue;

        // Check seat availability
        if (seatMap[eId] > 0) {
          seatMap[eId]--;
          allocations.push({
            studentId: student._id,
            electiveId: elective._id,
            assignedElective: elective.electiveName,
            preferenceRank: i + 1,
            status: 'Approved',
          });
          allocated = true;
          break;
        }
      }

      // If not allocated → waitlist on first preference (or any valid one)
      if (!allocated) {
        for (let i = 0; i < student.preferences.length; i++) {
          const prefName = student.preferences[i];
          const elective = electives.find((e) => e.electiveName === prefName && e.isActive);
          if (!elective) continue;

          const eId = elective._id.toString();
          waitlistCountMap[eId]++;

          allocations.push({
            studentId: student._id,
            electiveId: elective._id,
            assignedElective: elective.electiveName,
            preferenceRank: i + 1,
            status: 'Waitlisted',
            waitlistPosition: waitlistCountMap[eId],
          });
          break;
        }
      }
    }

    // Bulk insert allocations
    await Allocation.insertMany(allocations);

    // Update available seats in DB
    for (const elective of electives) {
      const eId = elective._id.toString();
      elective.availableSeats = seatMap[eId];
      await elective.save();
    }

    res.json({
      message: 'Allocation completed successfully',
      totalStudents: sorted.length,
      approved: allocations.filter((a) => a.status === 'Approved').length,
      waitlisted: allocations.filter((a) => a.status === 'Waitlisted').length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get allocation results
// @route GET /api/admin/results
const getAllResults = async (req, res) => {
  try {
    const results = await Allocation.find()
      .populate('studentId', 'name usn branch cgpa backlog')
      .populate('electiveId', 'electiveName faculty code');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all students (admin)
// @route GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Admin analytics
// @route GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const profileComplete = await Student.countDocuments({ profileComplete: true });
    const submitted = await Student.countDocuments({ preferences: { $exists: true, $not: { $size: 0 } } });
    const approved = await Allocation.countDocuments({ status: 'Approved' });
    const waitlisted = await Allocation.countDocuments({ status: 'Waitlisted' });
    const totalElectives = await Elective.countDocuments({ isActive: true });

    // Per elective breakdown
    const electives = await Elective.find({ isActive: true });
    const electiveBreakdown = electives.map((e) => ({
      name: e.electiveName,
      total: e.totalSeats,
      available: e.availableSeats,
      filled: e.totalSeats - e.availableSeats,
    }));

    res.json({
      totalStudents,
      profileComplete,
      submitted,
      approved,
      waitlisted,
      totalElectives,
      electiveBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Admin login
// @route POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Seed default admin
// @route POST /api/admin/seed
const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: 'admin@elective.com' });
    if (existing) return res.json({ message: 'Admin already exists' });
    await Admin.create({ name: 'Super Admin', email: 'admin@elective.com', password: 'admin123' });
    res.json({ message: 'Admin seeded: admin@elective.com / admin123' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update allocation status manually
// @route PUT /api/admin/allocation/:id
const updateAllocationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allocation = await Allocation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  runAllocationEngine,
  getAllResults,
  getAllStudents,
  getAnalytics,
  adminLogin,
  seedAdmin,
  updateAllocationStatus,
};