const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getOwnerDashboard,
 
} = require("../controllers/ownerDashboardController");

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("owner"),
  getOwnerDashboard,
  
);


module.exports = router;
