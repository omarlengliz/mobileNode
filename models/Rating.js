// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Rating scale from 1 to 5
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  containsBadWords: {
    type: Boolean,
    default: false,
  },
  badWords: {
    type: [String], 
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
