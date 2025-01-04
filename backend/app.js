const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authenticate-router.js");
const userRoutes = require("./routes/user-router");
const errorHandler = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ✅ Morgan middleware for logging HTTP requests
app.use(morgan("combined"));

// ✅ Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Error Handling Middleware
app.use(errorHandler);

module.exports = app;
