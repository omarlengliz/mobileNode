//book routes

const express = require('express');
const { getBooks, getBookById, addBook, updateBook } = require('../controllers/BookController');
const router = express.Router();

router.get("/getAll", getBooks);
router.get("/:id", getBookById);
router.post("/add", addBook);
router.put("/:id", updateBook);

module.exports = router;
