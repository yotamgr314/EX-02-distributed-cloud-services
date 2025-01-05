const express = require("express");
const { createUser, getUsers } = require("../controllers/user-controller");
const authenticateMiddleware = require("../middlewares/authenticate-middleware");

const router = express.Router();

router.post("/create", createUser);

router.get("/", authenticateMiddleware, getUsers);

module.exports = router;
