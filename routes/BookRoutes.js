//book routes

const express = require('express');
const { getBooks, getBookById, addBook, updateBook, deleteBook, isBookBuyed, paymentClient, payBook, getBooksA } = require('../controllers/BookController');
const authenticateToken = require('../config/jwt');
const router = express.Router();

router.get("/getAll", getBooks);
router.get("/getAllA", authenticateToken, getBooksA);
router.get("/:id", getBookById);
router.post("/add",authenticateToken ,  addBook);
router.put("/:id", updateBook);
router.delete("/:id",deleteBook ) 
router.get("/isBuyed/:bookId/:id", isBookBuyed);
router.post("/payment-intent/create", paymentClient);
router.post("/pay/:bookId/:id", payBook);
module.exports = router;
