const express = require("express");
const router = express.Router();
const { createCourse, getCoursesWithEnrollment, enrollStudent, updateCourse } = require("../controllers/course-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

// Create a new course
router.post("/create", authenticateMiddleware, createCourse);

// Get all courses with enrollment status
router.get("/", authenticateMiddleware, getCoursesWithEnrollment);

// Enroll a student in a course
router.post("/:courseId/enroll", authenticateMiddleware, enrollStudent);

router.put("/:courseId/edit", authenticateMiddleware, updateCourse);

module.exports = router;
