const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1]; 

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Replace with your actual secret key

    // Attach the decoded userId to the request object for use in subsequent routes
    req.userId = decoded.userId;
    console.log('Decoded User ID:', req.userId);  // Debug: Log the decoded userId

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Log error for debugging purposes
    console.error('Token verification error:', error);

    // Handle specific error types
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or malformed token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = verifyUser;
