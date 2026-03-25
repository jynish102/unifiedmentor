const express = require("express");
const router = express.Router();

const {
  createAmenityBooking,
  getAllAmenityBookings,
  getBookingsByAmenity,
  deleteAmenityBooking,
  getAvailableAmenities,
} = require("../controllers/amenityBookingController");

router.post("/", createAmenityBooking);
router.get("/", getAllAmenityBookings);
router.get("/amenity/:amenityId", getBookingsByAmenity);
router.delete("/:id", deleteAmenityBooking);
router.get("/available-amenities", getAvailableAmenities);


module.exports = router;
