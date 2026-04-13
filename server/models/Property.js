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
      enum: ["monthly", "yearly", "daily"],
      default: "monthly",
      required: function () {
        return this.listingType === "rent";
      },
    },

    category: {
      type: String,
      enum: ["residential", "commercial"],
      required: true,
      default: "residential",
    },

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "House",
        "Villa",
        "Shop",
        "Warehouse",
        "land",
        "others",
      ],
    },

    listingType: {
      type: String,
      enum: ["rent", "sale"],
      default: "rent",
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
    },

    furnishing: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Semi-Furnished",
    },

    floor: {
      type: Number,
      default: 0,
    },
    totalFloors: {
      type: Number,
      default: 0,
    },

    parking: Boolean,

    amenities: {
      lift: Boolean,
      gym: Boolean,
      security: Boolean,
      wifi: Boolean,
    },

    // NEW
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
      enum: ["available", "maintenance","booked" , "sold"],
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


propertySchema.virtual("availableUnits").get(function () {
  return this.units - this.occupied;
});


propertySchema.set("toJSON", { virtuals: true });
propertySchema.set("toObject", { virtuals: true });


module.exports = mongoose.model("Property", propertySchema);

module.exports = mongoose.model("Property", propertySchema);
