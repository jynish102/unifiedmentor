const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    address: {
      type: String,
      required: true,
    },

    city: String,

    price: {
      type: Number,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Shop"],
    },

    images: [
        {
      type: String,
    },],

    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", propertySchema);
