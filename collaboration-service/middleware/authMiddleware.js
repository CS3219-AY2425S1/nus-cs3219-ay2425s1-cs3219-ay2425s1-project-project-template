const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  try {
    const userProfile = await viewUserProfile(authHeader);
    req.userProfile = userProfile; // Attach user profile to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle the error from the viewUserProfile function
    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      res.status(401).json({ message: 'Unauthorized' }); // Send a 401 response if unauthorized
    } else {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal Server Error' }); // Handle other errors
    }
  }
};

const viewUserProfile = async (authHeader) => {
  try {
    const response = await axios.get('http://localhost/api/user/profile', {
      headers: {
        'Authorization': authHeader, // Set the Authorization header
      },
    });
    return response.data; // Return the user profile data
  } catch (error) {
    // Propagate the error to the middleware
    throw error; 
  }
};

module.exports = {
  authMiddleware,
  viewUserProfile
};
