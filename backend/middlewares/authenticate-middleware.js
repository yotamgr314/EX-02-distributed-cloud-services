const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // מציאת המשתמש במסד הנתונים
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      error.statusCode = 401;
      return next(error);
    }
  } else {
    const error = new Error("Not authorized, no token");
    error.statusCode = 401;
    return next(error);
  }
};

module.exports = authenticateMiddleware;
