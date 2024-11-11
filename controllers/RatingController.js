const Rating = require('../models/Rating');
const User = require('../models/Users'); // Assuming you have a User model
const Book = require('../models/Book'); // Assuming you have a Book model
const detectProfanityWithTogetherAI = require('../config/profanityDetector'); // Assuming the profanity detection function is in utils
const censorBadWords = (comment, badWords) => {
    let censoredComment = comment;
    badWords.forEach((badWord) => {
      const regex = new RegExp(`\\b${badWord}\\b`, 'gi'); // Match whole words, case insensitive
      censoredComment = censoredComment.replace(regex, '****');
    });
    return censoredComment;
  };
exports.addRating = async (req, res) => {
  try {
    const { rate, comment, userId } = req.body;
    const { bookId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Detect bad words in the comment
    const result = await detectProfanityWithTogetherAI(comment);
    const containsBadWords = result.badwords.length > 0;
    const badWordsList = result.badwords;
    if (containsBadWords) {
        user.badWordCount += 1;
  
        // Block user if badWordCount exceeds 5
        if (user.badWordCount > 5) {
          user.isBlocked = true;
        }
  
        await user.save(); // Save the updated user
      }
    // Create and save a new rating
    const newRating = new Rating({
      rate,
      comment,
      containsBadWords,
      badWords: badWordsList,
      user: userId,
      book: bookId,
    });

    await newRating.save();
   
    res.status(201).json({ message: 'Rating added successfully', rating: newRating });
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
};
exports.getBookRatings = async (req, res) => {
    try {
      const { bookId } = req.params;
  
      // Check if the book exists
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      

      // Find ratings for the specified book and populate the user details
      const ratings = await Rating.find({ book: bookId }).populate('user', 'firstname lastname');
      const censoredRatings = ratings.map((rating) => {
        const censoredComment = rating.containsBadWords ? censorBadWords(rating.comment, rating.badWords) : rating.comment;
        return {
          ...rating.toObject(),
          comment: censoredComment,
        };
      });
  
      res.status(200).json({ ratings: censoredRatings });
  
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
  };


// Get all comments with bad words made by a specific user, along with total counts
exports.getUserBadWordsHistory = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Count total comments made by the user
      const totalComments = await Rating.countDocuments({ user: userId });
  
      // Count comments with bad words
      const commentsWithBadWordsCount = await Rating.countDocuments({ user: userId, containsBadWords: true });
  
      // Find all ratings by this user that contain bad words
      const badWordsHistory = await Rating.find({ user: userId, containsBadWords: true })
        .populate('book', 'name') // Populate book information if needed
        .select('comment badWords date'); // Select only relevant fields
  
      // Send response with total counts and bad words history
      res.status(200).json({
        user:user,
        totalComments,
        commentsWithBadWordsCount,
        badWordsHistory,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bad words history', error: error.message });
    }
  }
