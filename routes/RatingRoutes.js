const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');

// Route to add a rating to a specific book, with validation
router.post('/books/:bookId/ratings', ratingController.addRating);

// Route to get all ratings for a specific book
router.get('/books/:bookId/ratings', ratingController.getBookRatings);
router.get('/users/:userId/badwords-history', ratingController.getUserBadWordsHistory);

module.exports = router;