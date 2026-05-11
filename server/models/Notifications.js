const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,

    message: String,

    type: {
      type: String,
      enum: ["property-request", "booking","amenity-booking", "maintenance"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    
    relatedModel: {
      type: String,
      enum: ["Property" , "Booking", "AmenityBooking","Maintenance" ],
    },

 
    redirectUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notifications", notificationSchema);
