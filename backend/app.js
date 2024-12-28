// IMPORT MODELS SECTION

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB } = require("./config/db");

// IMPORT ROUTES SECTION 

const app = express();

connectDB();

// MIDDLEWARES SECTION
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON in request body
app.use(morgan("dev")); // Log HTTP requests

//ROUTES SECTION

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Course Registration API");
});



module.exports = app;