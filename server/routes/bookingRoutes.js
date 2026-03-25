const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  deleteBooking,
  getAvailableProperties,
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/", getAllBookings);

router.get("/my-bookings", authMiddleware, getUserBookings);

router.put("/:id",authMiddleware,adminMiddleware, updateBookingStatus);

router.delete("/:id",authMiddleware,adminMiddleware, deleteBooking);

router.get("/available-properties", getAvailableProperties);

module.exports = router;
