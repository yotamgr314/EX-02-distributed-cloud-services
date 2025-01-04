const express = require("express");
const { createUser, getUsers } = require("../controllers/user-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

const router = express.Router();

// ✅ יצירת משתמש חדש
router.post("/create", createUser);

// ✅ קבלת רשימת משתמשים (רק למשתמשים מאומתים)
router.get("/", authenticateMiddleware, getUsers);

module.exports = router;
