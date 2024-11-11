//rollers/statisticsController.js
const Book = require('../models/Book');
const User = require('../models/Users');
const Order = require('../models/Order');
const Genre = require('../models/Genre');

exports.getStatistics = async (req, res) => {
    try {
      // Fetch common statistics available to all users
      const totalUsers = await User.countDocuments();
      const totalAuthors = await User.countDocuments({ role: 'author' });
      const totalBooks = await Book.countDocuments();
  
      // Initialize the JSON response with common data
      const responseData = {
        totalUsers,
        totalAuthors,
        totalBooks,
      };
  
      // If the user is an admin, add advanced statistics to the response
      if (req.user.role === 'admin') {
        // Top 5 Genres by Book Count
        const topGenresByBookCount = await Book.aggregate([
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'genres',
              localField: '_id',
              foreignField: '_id',
              as: 'genre',
            },
          },
          { $unwind: '$genre' },
          { $project: { _id: 0, genre: '$genre.name', count: 1 } },
        ]);
  
        // Top 5 Most Purchased Books
        const topPurchasedBooks = await Order.aggregate([
          { $group: { _id: '$Book', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'books',
              localField: '_id',
              foreignField: '_id',
              as: 'book',
            },
          },
          { $unwind: '$book' },
          { $project: { _id: 0, bookName: '$book.name', purchaseCount: '$count' } },
        ]);
  
        // Top 5 Genres by Purchases
        const topGenresByPurchases = await Order.aggregate([
          {
            $lookup: {
              from: 'books',
              localField: 'Book',
              foreignField: '_id',
              as: 'book',
            },
          },
          { $unwind: '$book' },
          {
            $group: { _id: '$book.genre', count: { $sum: 1 } },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'genres',
              localField: '_id',
              foreignField: '_id',
              as: 'genre',
            },
          },
          { $unwind: '$genre' },
          { $project: { _id: 0, genre: '$genre.name', purchaseCount: '$count' } },
        ]);
  
        // Recent Users (Last 5 Registered Users)
        const recentUsers = await User.find({ 'role': { $in: ["user","author"] } }) 
          .sort({ createdAt: -1 })
          .limit(5)
          .select('firstname lastname email createdAt role');
  
        // Recent Books (Last 5 Published Books)
        const recentBooks = await Book.find()
          .sort({ releaseDate: -1 })
          .limit(5)
          .select('name author releaseDate imageUrl')
          .populate('author', 'firstname lastname'); // Populate author name
  
        // Add admin-specific data to the response
        responseData.adminData = {
          topGenresByBookCount,
          topPurchasedBooks,
          topGenresByPurchases,
          recentUsers,
          recentBooks,
        };
      }else if (req.user.role === 'author') {
        // Author-specific statistics
  
        const authorId = req.user._id;
  
        // Total Books Published by this author
        const totalBooksByAuthor = await Book.countDocuments({ author: authorId });
  
        // Total Sales of Author's Books
        const totalSales = await Order.countDocuments({ Book: { $in: await Book.find({ author: authorId }).select('_id') } });
  
        // Top 5 Purchased Books by This Author
        const topPurchasedBooksByAuthor = await Order.aggregate([
          {
            $lookup: {
              from: 'books',
              localField: 'Book',
              foreignField: '_id',
              as: 'book',
            },
          },
          { $unwind: '$book' },
          { $match: { 'book.author': authorId } },
          { $group: { _id: '$book._id', name: { $first: '$book.name' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          { $project: { _id: 0, bookName: '$name', purchaseCount: '$count' } },
        ]);
  
        // Top Genres of Author's Books
        const topGenresByAuthor = await Book.aggregate([
          { $match: { author: authorId } },
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'genres',
              localField: '_id',
              foreignField: '_id',
              as: 'genre',
            },
          },
          { $unwind: '$genre' },
          { $project: { _id: 0, genre: '$genre.name', count: 1 } },
        ]);
  
        // Add author-specific data to the response
        responseData.authorData = {
          totalBooksByAuthor,
          totalSales,
          topPurchasedBooksByAuthor,
          topGenresByAuthor,
        };
      }
  
      // Send the response
      res.json(responseData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  };