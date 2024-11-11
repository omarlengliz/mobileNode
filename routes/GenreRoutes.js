
const express = require('express');
const { fetchAll, addGenre, deleteGenre } = require('../controllers/GenreController');
const router = express.Router();

router.get("/getAll",fetchAll); 
router.post("/add",addGenre);
router.delete("/delete/:id",deleteGenre);


module.exports = router;