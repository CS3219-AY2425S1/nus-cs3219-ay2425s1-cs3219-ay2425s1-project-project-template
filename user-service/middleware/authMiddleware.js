const jwt = require('jsonwebtoken');
const findById = require('../controller/userManipulation')

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // load latest user info from DB
    const dbUser = findById(user.id);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    req.user = { id: dbUser.id, username: dbUser.username, email: dbUser.email, isAdmin: dbUser.isAdmin };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;