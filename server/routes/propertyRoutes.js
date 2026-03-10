const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadPropertyImages");
const authMiddleware = require("../middleware/authMiddleware");
const ownerOrAdmin = require("../middleware/ownerOrAdmin");

const {
  addProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

router.post(
  "/add",
  authMiddleware,
  ownerOrAdmin,
  upload.array("images", 5),
  addProperty,
);

router.get("/", getProperties);
router.get("/:id", getPropertyById);

router.put("/:id", authMiddleware, ownerOrAdmin, updateProperty);
router.delete("/:id", authMiddleware, ownerOrAdmin, deleteProperty);

module.exports = router;
