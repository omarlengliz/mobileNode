
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    pages: {
        type: Number,
        required: true
    },
    pageContent: [{
        type: String
    }],
    releaseDate: {
        type: Date,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    imageUrl: { 
        type: String,
        required: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;