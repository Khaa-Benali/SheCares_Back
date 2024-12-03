const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();

// Enable CORS for all routes
app.use(cors()); 

// Body parser middleware to parse JSON request bodies (Using Express built-in method)
app.use(express.json()); 

// Connect to the database
require('./Models/db');

// Test route for ping
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Import and use Routes
const AuthRouter = require('./Routes/AuthRouter');
const UserRouter = require('./Routes/UserRouter');
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Set the port from environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
