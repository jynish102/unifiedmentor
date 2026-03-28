const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getAdminDashboard,
  getUserDashboard,
} = require("../controllers/dashboardController");

router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminDashboard,
  
);
router.get("/user", authMiddleware, authorizeRoles("user"), getUserDashboard);

module.exports = router;
