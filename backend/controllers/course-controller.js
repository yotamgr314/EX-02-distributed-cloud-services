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

module.exports = { createCourse };
