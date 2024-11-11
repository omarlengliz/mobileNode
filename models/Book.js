const mongoose = require('mongoose');
const Users = require('./Users');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    pageContent: [
        {
            title: {
                type: String, 
                required: true,
            },
            content: {
                type: String, 
                required: true,
            },
        },
    ],
    releaseDate: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
    language: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price : {
        type:Number , 
        default : 0
    },
    buyers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
   
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
