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
      min: 0,
    },

    capacity: {
      type: Number,
      default: 1,
      min: 1,
    },

    location: {
      type: String,
      required: true,
    },

    operatingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
      closesNextDay: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: ["operational", "maintenance"],
      default: "operational",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],

      required: function () {
        return this.status === "maintenance";
      },
    },

    upcomingMaintenanceDate: {
      type: Date,
      default: null,
    },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);
amenitySchema.index({ property: 1 });
module.exports = mongoose.model("Amenity", amenitySchema);
