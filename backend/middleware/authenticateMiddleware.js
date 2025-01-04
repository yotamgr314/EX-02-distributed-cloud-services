const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {// NOTE:Middleware to protect routes (requires a valid token).

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

exports.restrictTo = (...roles) => { // NOTE: its a Middleware to restrict access to certain roles.

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};
