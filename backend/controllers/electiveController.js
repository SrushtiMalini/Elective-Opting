const Elective = require('../models/Elective');

// @desc  Get all active electives
// @route GET /api/electives
const getAllElectives = async (req, res) => {
  try {
    const electives = await Elective.find({ isActive: true });
    res.json(electives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single elective
// @route GET /api/electives/:id
const getElective = async (req, res) => {
  try {
    const elective = await Elective.findById(req.params.id);
    if (!elective) return res.status(404).json({ message: 'Elective not found' });
    res.json(elective);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add elective (admin)
// @route POST /api/electives/add
const addElective = async (req, res) => {
  try {
    const {
      electiveName, code, faculty, department,
      totalSeats, difficulty, careerTag, description,
      eligibleBranches, minCGPA,
    } = req.body;

    const exists = await Elective.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Elective code already exists' });

    const elective = await Elective.create({
      electiveName, code, faculty, department,
      totalSeats, difficulty, careerTag, description,
      eligibleBranches, minCGPA,
    });

    res.status(201).json(elective);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update elective (admin)
// @route PUT /api/electives/update/:id
const updateElective = async (req, res) => {
  try {
    const elective = await Elective.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!elective) return res.status(404).json({ message: 'Elective not found' });
    res.json(elective);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete elective (admin)
// @route DELETE /api/electives/delete/:id
const deleteElective = async (req, res) => {
  try {
    const elective = await Elective.findByIdAndDelete(req.params.id);
    if (!elective) return res.status(404).json({ message: 'Elective not found' });
    res.json({ message: 'Elective deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllElectives, getElective, addElective, updateElective, deleteElective };