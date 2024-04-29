
const express = require('express');
const { fetchAll } = require('../controllers/GenreController');
const router = express.Router();

router.get("/getAll",fetchAll); 

module.exports = router;