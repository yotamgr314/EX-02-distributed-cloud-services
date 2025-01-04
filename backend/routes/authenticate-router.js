const express = require("express");
const { loginUser } = require("../controllers/authenticate-controller");

const router = express.Router();

// ✅ התחברות משתמש
router.post("/login", loginUser);

module.exports = router;
