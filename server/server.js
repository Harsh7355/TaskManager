const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import the CORS package
const authrouter = require('./routes/authroutes');
const projectrouter=require('./routes/projectroutes')
const server = express();

// CORS options to allow requests only from localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173', // Allow frontend to access backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow authorization header
};


server.use(cors(corsOptions));  // Use CORS middleware with custom options

// Middleware to parse JSON requests
server.use(express.json());

// MongoDB connection (replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://Adhamkhor:Mahakal%401234@cluster0.rqwqs4c.mongodb.net/TaskManagaer?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Use authrouter for routes related to authentication
server.use('/api/auth', authrouter);
server.use('/api/project', projectrouter);

// Start the server on port 8081
server.listen(8081, () => {
  console.log('Server is running on port 8081');
});
