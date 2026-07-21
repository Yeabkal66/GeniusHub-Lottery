const express = require('express');
const router = express.Router();
const { 
  getStatus, 
  createApplication, 
  getApplication,
  confirmPayment  // ✅ Import the new function
} = require('../controllers/lotteryController');

router.get('/status', getStatus);
router.post('/apply', createApplication);
router.get('/application/:phoneNumber', getApplication);
router.post('/payment-confirm', confirmPayment);  // ✅ New route

module.exports = router;
