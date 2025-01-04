const User = require("../models/User");

// ✅ יצירת משתמש חדש
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      yearOfStudy,
      registeredCourses,
      creditPoints,
    } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // יצירת משתמש חדש
    const newUser = new User({
      name,
      email,
      password,
      role,
      address,
      yearOfStudy,
      registeredCourses,
      creditPoints,
    });

    // שמירת המשתמש במסד הנתונים
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ קבלת רשימת משתמשים
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createUser, getUsers };
