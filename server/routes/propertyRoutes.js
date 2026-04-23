const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadPropertyImages");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  addProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

router.post(
  "/add",
  authMiddleware,
  authorizeRoles(["owner"]),
  upload.array("images", 5),
  addProperty,
);

router.get("/", getProperties);
router.get("/my-properties", authMiddleware, getMyProperties);
router.get("/:id", authMiddleware, getPropertyById);


router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(["owner"]),
  upload.array("images", 5),
  updateProperty,
);
router.delete("/:id", authMiddleware, authorizeRoles(["owner"]), deleteProperty);

module.exports = router;
