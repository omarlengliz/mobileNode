
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Book: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Reference to the User model
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
