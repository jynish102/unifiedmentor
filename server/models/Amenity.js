const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      default: 1,
    },

    location: String,

    operatingHours: {
      start: String,
      end: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    images: [String],
  },
  { timestamps: true },
);
amenitySchema.index({ property: 1 });
module.exports = mongoose.model("Amenity", amenitySchema);
