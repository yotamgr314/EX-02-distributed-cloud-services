const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const {
  errorHandler,
  requestLogger,
} = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authenticate-router");
const userRoutes = require("./routes/user-router");

dotenv.config();
connectDB();

const app = express();

// ✅ Morgan Middleware for logging HTTP requests
app.use(requestLogger);

// ✅ Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Error Handling Middleware
app.use(errorHandler);

module.exports = app;
