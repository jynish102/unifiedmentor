const express = require("express");
const router = express.Router();

const { createSupportRequest } = require("../controllers/supportController");

// public route (no login needed)
router.post("/support", createSupportRequest);

module.exports = router;
