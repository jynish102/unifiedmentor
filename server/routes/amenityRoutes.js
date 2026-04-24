const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadPropertyImages");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createAmenity,
  getAllAmenities,
  getMyAmenities,
  getAmenityById,
  getAmenitiesByProperty,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/amenityController");

// Add amenity to property
router.post("/:propertyId",
  authMiddleware,
  authorizeRoles("owner"), 
  upload.array("images", 5), 
  createAmenity);

// Get all amenities
router.get("/", getAllAmenities);
router.get("/my-amenities", authMiddleware, authorizeRoles("owner"), getMyAmenities)
router.get("/:id" , getAmenityById)

// Get amenities by property
router.get("/:propertyId", getAmenitiesByProperty);

// Update amenity
router.put("/:id",authMiddleware,authorizeRoles("owner"), upload.array("images", 5) , updateAmenity);

// Delete amenity
router.delete("/:id", deleteAmenity);

module.exports = router;
