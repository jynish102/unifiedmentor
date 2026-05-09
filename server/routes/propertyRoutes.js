const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadPropertyImages");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  addProperty,
  getPropertyRequests,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  updateApprovalStatus,
  deleteProperty,
} = require("../controllers/propertyController");

router.post(
  "/add",
  authMiddleware,
  authorizeRoles("owner"),
  upload.array("images", 5),
  addProperty,
);

router.get( "/requests" , authMiddleware, authorizeRoles("admin"), getPropertyRequests)
router.get("/", getProperties);
router.get("/my-properties", authMiddleware, getMyProperties);
router.get(
  "/:id",
  authMiddleware,
  getPropertyById,
);


router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("owner"),
  upload.array("images", 5),
  updateProperty,
);

router.put("/request/:id", authMiddleware, authorizeRoles("admin"), updateApprovalStatus);
router.delete("/:id", authMiddleware, authorizeRoles("owner"), deleteProperty);

module.exports = router;
