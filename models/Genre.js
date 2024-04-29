const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
