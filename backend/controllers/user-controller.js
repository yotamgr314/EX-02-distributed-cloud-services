const User = require("../models/User");

// ✅ יצירת משתמש חדש
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, address, yearOfStudy, creditPoints } =
      req.body;

    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error); // ✅ העברת השגיאה ל-Middleware
    }

    // יצירת משתמש חדש
    const newUser = new User({
      name,
      email,
      password,
      role,
      address,
      yearOfStudy,
      creditPoints,
    });

    // שמירת המשתמש במסד הנתונים
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    next(error); // ✅ העברת שגיאות נוספות ל-Middleware
  }
};

// ✅ קבלת רשימת משתמשים
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error); // ✅ העברת השגיאות ל-Middleware
  }
};

module.exports = { createUser, getUsers };
