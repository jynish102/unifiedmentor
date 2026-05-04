const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },

    inquiryType: {
      type: String,
      enum: ["buy property", "sell property", "rent property", "schedule visit", "reactivate account" , "other"],
      default: "buy property",
    },

    message: {
        type: String,
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
