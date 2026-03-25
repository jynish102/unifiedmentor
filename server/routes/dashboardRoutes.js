const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getAdminDashboard , getUserDashboard} = require("../controllers/dashboardController");

router.get("/admin", authMiddleware, adminMiddleware, getAdminDashboard);
router.get("/user", authMiddleware, getUserDashboard,getUserDashboard);

module.exports = router;
