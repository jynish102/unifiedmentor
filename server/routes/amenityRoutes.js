const express = require("express");
const router = express.Router();

const {
  createAmenity,
  getAllAmenities,
  getAmenitiesByProperty,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/amenityController");

// Add amenity to property
router.post("/:propertyId", createAmenity);

// Get all amenities
router.get("/", getAllAmenities);

// Get amenities by property
router.get("/:propertyId", getAmenitiesByProperty);

// Update amenity
router.put("/:id", updateAmenity);

// Delete amenity
router.delete("/:id", deleteAmenity);

module.exports = router;
