const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/profileController.js");

router.get("/me", authMiddleware, getMe);

module.exports = router;
