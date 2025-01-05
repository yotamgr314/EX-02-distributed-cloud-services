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

      // Fetch user details from the database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Attach full user details to the request object
      req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        yearOfStudy: user.yearOfStudy,
        creditPoints: user.creditPoints,
      };

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
