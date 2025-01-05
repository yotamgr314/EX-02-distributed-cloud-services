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
  

const updateCourse = async (req, res, next) => {
    try {
      if (req.user.role !== "Staff") {
        logError(`Unauthorized course edit attempt by ${req.user.email}`);
        return res.status(403).json({ error: "Only staff members can edit courses" });
      }
  
      const { courseId } = req.params;
      const updates = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // ✅ עדכון הקורס במסד הנתונים
      Object.assign(course, updates);
      const updatedCourse = await course.save();
  
      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
  
      logInfo(`Course "${course.name}" updated by ${req.user.email}`);
    } catch (error) {
      logError(`Error updating course: ${error.message}`);
      next(error);
    }
  };

  const deleteCourse = async (req, res, next) => {
    try {
      // בדיקה אם המשתמש הוא Staff
      if (req.user.role !== "Staff") {
        logError(`Unauthorized deletion attempt by ${req.user.email}`);
        return res.status(403).json({ error: "Only staff members can delete courses" });
      }
  
      const { courseId } = req.params;
  
      // חיפוש הקורס לפי ID
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // מחיקת הקורס
      await Course.findByIdAndDelete(courseId);
  
      logInfo(`Course deleted successfully by ${req.user.email}: ${course.name}`);
  
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      logError(`Error deleting course: ${error.message}`);
      next(error);
    }
  };
  
  const getStudentCourses = async (req, res, next) => {
    try {
      // בדיקה אם המשתמש הוא Student
      if (req.user.role !== "Student") {
        logError(`Unauthorized access by ${req.user.email}`);
        return res.status(403).json({ error: "Only students can view their enrolled courses" });
      }
  
      // שליפת הקורסים של הסטודנט
      const studentId = req.user.id;
      
      const courses = await Course.find({ "enrolledStudents.studentId": studentId })
        .select("-__v")  // הסרת השדה __v מהתוצאה
        .populate("enrolledStudents.studentId", "name email");  // למילוי פרטי הסטודנט
  
      if (courses.length === 0) {
        return res.status(404).json({ error: "No courses found for this student" });
      }
  
      logInfo(`Courses retrieved for student ${req.user.email}`);
      res.status(200).json(courses);
    } catch (error) {
      logError(`Error retrieving courses: ${error.message}`);
      next(error);
    }
  };

  const unregisterStudent = async (req, res, next) => {
    try {
      // בדיקה אם המשתמש הוא Student
      if (req.user.role !== "Student") {
        logError(`Unauthorized access by ${req.user.email}`);
        return res.status(403).json({ error: "Only students can unregister from courses" });
      }
  
      const { courseId } = req.params;
      const studentId = req.user.id;
  
      // חיפוש הקורס לפי ID
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      // בדיקה אם הסטודנט רשום לקורס
      const studentIndex = course.enrolledStudents.findIndex(
        student => student.studentId.equals(studentId)
      );
            
      if (studentIndex === -1) {
        return res.status(400).json({ error: "Student is not enrolled in this course" });
      }
  
      // מחיקת הסטודנט מהרשימה של הסטודנטים הרשומים
      course.enrolledStudents.splice(studentIndex, 1);
      await course.save();
  
      logInfo(`Student ${req.user.email} unregistered from course ${course.name}`);
  
      res.status(200).json({ message: "Successfully unregistered from course" });
    } catch (error) {
      logError(`Error unregistering student: ${error.message}`);
      next(error);
    }
  };
  
  const switchCourse = async (req, res, next) => {
    try {
      // בדיקה אם המשתמש הוא Student
      if (req.user.role !== "Student") {
        logError(`Unauthorized course switch attempt by ${req.user.email}`);
        return res.status(403).json({ error: "Only students can switch courses" });
      }
  
      const { currentCourseId, newCourseId } = req.body;
      const studentId = req.user.id;
  
      // שליפת הקורס המקורי
      const currentCourse = await Course.findById(currentCourseId);
      if (!currentCourse) {
        return res.status(404).json({ error: "Current course not found" });
      }
  
      // בדיקה אם הסטודנט רשום לקורס המקורי
      const studentIndex = currentCourse.enrolledStudents.findIndex(
        student => student.studentId.equals(studentId)
      );
      if (studentIndex === -1) {
        return res.status(400).json({ error: "Student is not enrolled in the current course" });
      }
  
      // שליפת הקורס החדש
      const newCourse = await Course.findById(newCourseId);
      if (!newCourse) {
        return res.status(404).json({ error: "New course not found" });
      }
  
      // בדיקה אם הקורס החדש מלא
      if (newCourse.enrolledStudents.length >= newCourse.maxStudents) {
        return res.status(400).json({ error: "The new course is full" });
      }
  
      // חישוב נקודות זכות חדשות
      const totalCredits =
        req.user.creditPoints - currentCourse.creditPoints + newCourse.creditPoints;
  
      if (totalCredits > 20) {
        return res.status(400).json({ error: "You cannot exceed 20 credit points" });
      }
  
      // ✅ מחיקת הסטודנט מהקורס המקורי
      currentCourse.enrolledStudents.splice(studentIndex, 1);
      await currentCourse.save();
  
      // ✅ הוספת הסטודנט לקורס החדש
      newCourse.enrolledStudents.push({
        studentId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        yearOfStudy: req.user.yearOfStudy,
      });
      await newCourse.save();
  
      // ✅ עדכון נקודות הזכות של הסטודנט
      req.user.creditPoints = totalCredits;
      await req.user.save();
  
      logInfo(`Student ${req.user.email} switched from course ${currentCourse.name} to ${newCourse.name}`);
  
      res.status(200).json({ message: "Course switch successful" });
    } catch (error) {
      logError(`Error switching courses: ${error.message}`);
      next(error);
    }
  };
  
  
  module.exports = { createCourse, getCoursesWithEnrollment, enrollStudent,updateCourse, deleteCourse, getStudentCourses,unregisterStudent,switchCourse};
  
  
  