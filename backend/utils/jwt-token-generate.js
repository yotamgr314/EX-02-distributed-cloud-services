const jwt = require("jsonwebtoken");

// ✅ פונקציה ליצירת טוקן JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

module.exports = generateToken;
