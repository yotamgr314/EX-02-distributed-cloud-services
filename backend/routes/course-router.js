const express = require("express");
const router = express.Router();
const { createCourse } = require("../controllers/course-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

router.post("/create", authenticateMiddleware, createCourse);

module.exports = router;
