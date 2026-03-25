const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceByProperty,
  getTenantMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} = require("../controllers/maintenanceController");


// CREATE REQUEST
router.post("/", createMaintenance);

// GET ALL
router.get("/",authMiddleware, getAllMaintenance);

// GET BY PROPERTY
router.get("/property/:propertyId", getMaintenanceByProperty);

// GET BY TENANT
router.get("/tenant/:tenantId", getTenantMaintenance);

// UPDATE STATUS
router.put("/:id",authMiddleware,adminMiddleware, updateMaintenanceStatus);

// DELETE
router.delete("/:id",authMiddleware,adminMiddleware, deleteMaintenance);

module.exports = router;
