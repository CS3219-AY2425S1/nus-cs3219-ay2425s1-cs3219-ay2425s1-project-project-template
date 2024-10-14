const { auth } = require('../config/firebaseConfig');

const authenticateToken = async (req, res, next) => {
  console.log("Verifying token");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token required' });

  try {
    const decodedToken = await auth.verifyIdToken(token); // Throws an error if token is not verified
    console.log("Verified token");
    req.user = decodedToken;
    next();
    return;
  } catch (error) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticateToken;
