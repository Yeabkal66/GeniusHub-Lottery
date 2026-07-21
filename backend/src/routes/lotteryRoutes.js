const express = require('express');
const router = express.Router();
const { getStatus, createApplication, getApplication } = require('../controllers/lotteryController');

router.get('/status', getStatus);
router.post('/apply', createApplication);
router.get('/application/:phoneNumber', getApplication);

module.exports = router;
