const User = require("../models/User");
const generateToken = require("../utils/jwt-token-generate");

// ✅ התחברות משתמש
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // מציאת המשתמש לפי אימייל
    const user = await User.findOne({ email });

    if (user && (await user.isPasswordValid(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { loginUser };
