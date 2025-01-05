const User = require("../models/User");
const generateToken = require("../utils/jwt-token-generate");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser };
