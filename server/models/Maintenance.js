const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    amenity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed", "rejected"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "medium",
    },

    updates: [
      {
        message: "string",
        status : "string",
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    completedAt: Date,

    rejectionReason: String,

    proofImages: [String],
  },
  { timestamps: true },
);


module.exports = mongoose.model("Maintenance", maintenanceSchema);
