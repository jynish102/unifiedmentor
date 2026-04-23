const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByProperty,
  getTenantMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} = require("../controllers/maintenanceController");

// CREATE REQUEST
router.post("/", authMiddleware, createMaintenance);

// GET ALL
router.get("/", authMiddleware, getAllMaintenance);

// GET BY PROPERTY
router.get("/property/:propertyId",authMiddleware, getMaintenanceByProperty);

// GET BY TENANT
router.get("/tenant/:tenantId", authMiddleware, getTenantMaintenance);

// UPDATE STATUS
router.put("/:id", authMiddleware, authorizeRoles(["owner"]), updateMaintenanceStatus);

// DELETE
router.delete("/:id", authMiddleware, authorizeRoles(["owner"]), deleteMaintenance);

module.exports = router;
