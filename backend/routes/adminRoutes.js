const express = require('express');
const router = express.Router();
const {
  runAllocationEngine,
  getAllResults,
  getAllStudents,
  getAnalytics,
  adminLogin,
  seedAdmin,
  updateAllocationStatus,
} = require('../controllers/allocationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', adminLogin);
router.post('/seed', seedAdmin); // one-time seed

router.post('/run-allocation', protect, adminOnly, runAllocationEngine);
router.get('/results', protect, adminOnly, getAllResults);
router.get('/students', protect, adminOnly, getAllStudents);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.put('/allocation/:id', protect, adminOnly, updateAllocationStatus);

module.exports = router;