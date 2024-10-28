const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract the user payload
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);

    if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access. Admin only.' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authMiddleware,
}