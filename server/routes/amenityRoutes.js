const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadPropertyImages");

const {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  getAmenitiesByProperty,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/amenityController");

// Add amenity to property
router.post("/:propertyId", upload.array("images", 5), createAmenity);

// Get all amenities
router.get("/", getAllAmenities);
router.get("/:id" , getAmenityById)

// Get amenities by property
router.get("/:propertyId", getAmenitiesByProperty);

// Update amenity
router.put("/:id", upload.array("images", 5) , updateAmenity);

// Delete amenity
router.delete("/:id", deleteAmenity);

module.exports = router;
