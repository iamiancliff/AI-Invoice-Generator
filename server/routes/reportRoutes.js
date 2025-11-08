const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getSummary } = require('../controllers/reportController');

const router = express.Router();

router.get('/summary', protect, getSummary);

module.exports = router;


