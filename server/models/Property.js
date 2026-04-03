const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    address: { type: String, required: true },
    city: String,

    price: { type: Number, required: true },
    deposit: Number,

    paymentFrequency: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Shop"],
    },

    bedrooms: Number,
    bathrooms: Number,
    area: Number,

    furnishing: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
    },

    floor: Number,
    totalFloors: Number,

    parking: Boolean,

    amenities: {
      lift: Boolean,
      gym: Boolean,
      security: Boolean,
      wifi: Boolean,
    },

    // ✅ NEW
    units: {
      type: Number,
      default: 1,
    },

    occupied: {
      type: Number,
      default: 0,
    },

    images: [String],

    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },

    availableFrom: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", propertySchema);
