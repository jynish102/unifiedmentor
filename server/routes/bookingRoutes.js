const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
  getAvailableProperties,
} = require("../controllers/bookingController");

router.post("/", authMiddleware, createBooking);

router.get("/", getAllBookings);

router.get("/my-property-bookings", authMiddleware, getUserBookings);

router.put("/:id/status", authMiddleware, updateBookingStatus);

router.delete("/:id", authMiddleware, authorizeRoles(["admin"]), deleteBooking);

router.get("/available-properties", getAvailableProperties);

module.exports = router;
