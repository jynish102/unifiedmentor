const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadPropertyImages");
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
  getMyAssignments,
  uploadProof,
  deleteProofImage,
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
router.put("/:id/status", authMiddleware, authorizeRoles("owner" , "staff"), updateMaintenanceStatus);

// ASSIGN MAINTENANCE
router.put("/:id/assign", authMiddleware, authorizeRoles("owner"), assignMaintenance);

router.get("/my-assignments", authMiddleware, authorizeRoles("staff"), getMyAssignments);

router.put(
  "/:id/upload-proof",
  authMiddleware,
  authorizeRoles("staff"),
  upload.array("images", 5),
  uploadProof,
);

router.put("/maintenance/delete-proof", authMiddleware, authorizeRoles("staff"), deleteProofImage);

// DELETE
router.delete("/:id", authMiddleware, authorizeRoles("owner"), deleteMaintenance);

module.exports = router;
