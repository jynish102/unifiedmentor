const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByProperty,
  getOwnerMaintenance,
  getTenantMaintenance,
  getMyMaintenance,
  updateMaintenanceStatus,
  assignMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenanceController");

// CREATE REQUEST
router.post("/", authMiddleware, createMaintenance);

// GET ALL
router.get("/", authMiddleware, getAllMaintenance);

// GET BY OWNER
router.get("/owner", authMiddleware, authorizeRoles("owner"), getOwnerMaintenance);

// GET BY PROPERTY
router.get("/property/:propertyId",authMiddleware, getMaintenanceByProperty);

// GET BY TENANT
router.get("/tenant/:tenantId", authMiddleware, getTenantMaintenance);

//my requests
router.get("/my-maintenance", authMiddleware, authorizeRoles("tenant"), getMyMaintenance);

// UPDATE STATUS
router.put("/:id/status", authMiddleware, authorizeRoles("owner"), updateMaintenanceStatus);

// ASSIGN MAINTENANCE
router.put("/:id/assign", authMiddleware, authorizeRoles("owner"), assignMaintenance);

// DELETE
router.delete("/:id", authMiddleware, authorizeRoles("owner"), deleteMaintenance);

module.exports = router;
