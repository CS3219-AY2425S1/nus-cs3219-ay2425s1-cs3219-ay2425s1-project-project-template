const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['auth'];
  if (authHeader === '123') {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // Send a 401 response if unauthorized
  }
};

module.exports = {
  authMiddleware
}