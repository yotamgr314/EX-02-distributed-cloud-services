const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authenticateRoutes = require('./routes/authenticateRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// Create a write stream for logging requests to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

// Use morgan to log requests to the terminal and save them to a file
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Log to terminal

// Middleware
app.use(express.json());

// Routes
app.use('/api/authenticate', authenticateRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
