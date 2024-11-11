//book routes

const express = require('express');
const { getStatistics } = require('../controllers/statsController');
const authenticateToken = require('../config/jwt');
const router = express.Router();
router.get("/getStats",authenticateToken,getStatistics);

module.exports = router;
