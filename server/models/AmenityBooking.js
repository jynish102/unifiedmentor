const mongoose = require("mongoose");

const amenityBookingSchema = new mongoose.Schema(
  {
    amenity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    guests: {
      type: Number,
      default: 1,
    },

    totalPrice: {
      type: Number,
    },

    note: {
      type: String,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AmenityBooking", amenityBookingSchema);
