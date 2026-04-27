const express = require('express');
const router = express.Router();
const {
  getAllElectives,
  getElective,
  addElective,
  updateElective,
  deleteElective,
} = require('../controllers/electiveController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllElectives);
router.get('/:id', protect, getElective);
router.post('/add', protect, adminOnly, addElective);
router.put('/update/:id', protect, adminOnly, updateElective);
router.delete('/delete/:id', protect, adminOnly, deleteElective);

module.exports = router;