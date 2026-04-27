const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  updatePreferences,
  getMyResult,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/profile/:id', protect, getProfile);
router.put('/profile/:id', protect, updateProfile);
router.put('/preferences/:id', protect, updatePreferences);
router.get('/result/:id', protect, getMyResult);

module.exports = router;