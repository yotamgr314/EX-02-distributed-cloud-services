const Course = require("../models/Course");
const { logInfo, logError } = require("../utils/logger");

const createCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "Staff") {
      logError(`Unauthorized course creation attempt by ${req.user.email}`);
      return res
        .status(403)
        .json({ error: "Only staff members can create courses" });
    }

    const { name, lecturer, creditPoints, maxStudents } = req.body;

    const newCourse = new Course({
      name,
      lecturer,
      creditPoints,
      maxStudents,
    });

    const savedCourse = await newCourse.save();

    logInfo(`Course created: ${savedCourse.name} by ${req.user.email}`);

    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    logError(`Error creating course: ${error.message}`);
    next(error);
  }
};

// ✅ Get all courses with detailed enrollment status
const getCoursesWithEnrollment = async (req, res, next) => {
    try {
      if (req.user.role !== "Staff") {
        logError(`Unauthorized access to courses by ${req.user.email}`);
        return res.status(403).json({ error: "Only staff members can view courses" });
      }
  
      const courses = await Course.find().select("-__v");
  
      // Add enrollment status to each course
      const detailedCourses = courses.map(course => ({
        _id: course._id,
        name: course.name,
        lecturer: course.lecturer,
        creditPoints: course.creditPoints,
        maxStudents: course.maxStudents,
        enrolledStudents: course.enrolledStudents.map(student => ({
          name: student.name,
          email: student.email,
          yearOfStudy: student.yearOfStudy,
        })),
        totalEnrolled: course.enrolledStudents.length,
        freePlaces: course.maxStudents - course.enrolledStudents.length,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }));
  
      res.status(200).json(detailedCourses);
      logInfo(`Courses retrieved by ${req.user.email}`);
    } catch (error) {
      logError(`Error fetching courses: ${error.message}`);
      next(error);
    }
  };
  const enrollStudent = async (req, res, next) => {
    try {
      if (req.user.role !== "Student") {
        logError(`Unauthorized enrollment attempt by ${req.user.email}`);
        return res.status(403).json({ error: "Only students can enroll in courses" });
      }
  
      const { courseId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      const alreadyEnrolled = course.enrolledStudents.some(
        student => student.studentId.toString() === req.user.id.toString()
      );
      if (alreadyEnrolled) {
        return res.status(400).json({ error: "Student is already enrolled in this course" });
      }
  
      if (course.enrolledStudents.length >= course.maxStudents) {
        return res.status(400).json({ error: "The course is full" });
      }
  
      const totalCredits = req.user.creditPoints + course.creditPoints;
      if (totalCredits > 20) {
        return res.status(400).json({ error: "You cannot exceed 20 credit points" });
      }
  
      course.enrolledStudents.push({
        studentId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        yearOfStudy: req.user.yearOfStudy,
      });
  
      await course.save();
      res.status(200).json({ message: "Enrollment successful", course });
      logInfo(`${req.user.email} enrolled in ${course.name}`);
    } catch (error) {
      logError(`Error enrolling student: ${error.message}`);
      next(error);
    }
  };
  
  
  
  module.exports = { createCourse, getCoursesWithEnrollment, enrollStudent };
  
  
  