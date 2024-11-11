const jwt = require('jsonwebtoken');
const Users = require('../models/Users'); // Assuming you have a Users model

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token provided

  try {
    const decoded = jwt.verify(token, "secret"); // Replace with your secret
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Set req.user to the authenticated user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
