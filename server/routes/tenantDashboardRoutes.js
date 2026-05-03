const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getTenantDashboard,
} = require("../controllers/tenantDashboardController");

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("tenant"),
  getTenantDashboard,
);

module.exports = router;
