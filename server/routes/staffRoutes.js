const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const { getStaffDashboard } = require("../controllers/staffDashboardController");

router.get("/dashboard", authMiddleware, authorizeRoles("staff"), getStaffDashboard);

module.exports = router;
