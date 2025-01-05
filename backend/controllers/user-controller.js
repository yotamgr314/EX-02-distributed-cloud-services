const User = require("../models/User");

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      yearOfStudy,
      creditPoints,
      currentYear,
      currentSemester,
    } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    // יצירת משתמש חדש עם כל השדות הנדרשים
    const newUser = new User({
      name,
      email,
      password,
      role,
      address,
      yearOfStudy,
      creditPoints,
      currentYear,
      currentSemester,
    });

    // שמירת המשתמש במסד הנתונים
    const savedUser = await newUser.save();

    // החזרת תגובה
    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers };
