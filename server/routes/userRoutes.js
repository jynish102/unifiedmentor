const express = require("express");
const router = express.Router();
const { createStaff } = require("../controllers/userController");

router.post("/add", createStaff);

module.exports = router;
