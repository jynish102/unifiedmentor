const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");


router.get("/dashboard", authMiddleware, authorizeRoles("admin"), getAdminDashboard);

module.exports = router;
