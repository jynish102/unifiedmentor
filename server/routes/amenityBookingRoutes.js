const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createAmenityBooking,
  getAllAmenityBookings,
  getBookingsByAmenity,
  getUserBookings,
  updateBookingStatus,
  deleteAmenityBooking,
  getAvailableAmenities,
} = require("../controllers/amenityBookingController");

router.post("/", authMiddleware, createAmenityBooking);
router.get("/", getAllAmenityBookings);
router.get("/amenity/:amenityId", getBookingsByAmenity);
router.get("/my-amenity-bookings", authMiddleware, getUserBookings);

router.put(
  "/:id/status",
  authMiddleware,
  updateBookingStatus,
);
router.delete("/:id", authMiddleware, authorizeRoles(["admin"]), deleteAmenityBooking);
router.get("/available-amenities", getAvailableAmenities);


module.exports = router;
