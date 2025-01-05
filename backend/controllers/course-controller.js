const Course = require("../models/Course");

const createCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "Staff") {
      return res
        .status(403)
        .json({ error: "Only staff members can create courses" });
    }

    const { name, lecturer, creditPoints, maxStudents } = req.body;

    // יצירת קורס חדש במסד הנתונים
    const newCourse = new Course({
      name,
      lecturer,
      creditPoints,
      maxStudents,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCourse };
