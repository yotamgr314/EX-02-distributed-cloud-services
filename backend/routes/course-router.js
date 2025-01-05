const express = require("express");
const router = express.Router();
const { createCourse, getCoursesWithEnrollment } = require("../controllers/course-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

// Create a new course
router.post("/create", authenticateMiddleware, createCourse);

// Get all courses with enrollment status
router.get("/", authenticateMiddleware, getCoursesWithEnrollment);

module.exports = router;
