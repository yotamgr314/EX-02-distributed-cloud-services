const User = require("../models/User");
const generateToken = require("../utils/jwt-token-generate");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the password is valid
    if (user && (await user.isPasswordValid(password))) {
      // ✅ Return a response with the token containing full user details
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken({
          id: user._id,
          role: user.role,
          email: user.email,
        }),
      });
    } else {
      // Return an error if the credentials are invalid
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser };
