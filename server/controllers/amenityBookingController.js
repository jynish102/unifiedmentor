const AmenityBooking = require("../models/AmenityBooking");

// CREATE BOOKING (with conflict check)
exports.createAmenityBooking = async (req, res) => {
  try {
    const { amenity,  date, startTime, endTime } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const user = req.user.id;

    if (!amenity || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    // Conflict check
    const existing = await AmenityBooking.findOne({
      amenity,
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (existing) {
      return res.status(400).json({
        message: "Amenity already booked for this time",
      });
    }

    const booking = new AmenityBooking({
      amenity,
      user,
      date,
      startTime,
      endTime,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllAmenityBookings = async (req, res) => {
  const bookings = await AmenityBooking.find()
    .populate("amenity", "name")
    .populate("user", "fullname email");
  res.json({ success: true, data: bookings });
};


// GET BY AMENITY
exports.getBookingsByAmenity = async (req, res) => {
  const bookings = await AmenityBooking.find({
    amenity: req.params.amenityId,
  })
    .populate("amenity", "name")
    .populate("user", "fullname email");

  if (!bookings.length) {
    return res.status(404).json({
      message: "No bookings found for this amenity",
    });
  }  

  res.json({ success: true, data: bookings });
};

// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // validate status
    const validStatus = ["pending", "approved", "rejected", "cancelled"];
    console.log("USER:", req.user);
    console.log("STATUS:", req.body.status);

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const booking = await AmenityBooking.findById(id);
    // check exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Admin can approve/reject
    if (
      req.user.role === "admin" &&
      ["approved", "rejected"].includes(status)
    ) {
      booking.status = status;
    }

    // Tenant can cancel only THEIR booking
    else if (
      req.user.role.toLowerCase() === "Tenant" &&
      status === "cancelled" &&
      booking.user.toString() === req.user.id
    ) {
      booking.status = status;
    } else {
      return res.status(403).json({
        message: "Not allowed to perform this action",
      });
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE
exports.deleteAmenityBooking = async (req, res) => {
  await AmenityBooking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Amenity booking deleted"
  });
};

//Available Amenity

exports.getAvailableAmenities = async (req, res) => {
  const { date, startTime, endTime } = req.query;

  const booked = await AmenityBooking.find({
    date,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  }).distinct("amenity");

  const available = await Amenity.find({
    _id: { $nin: booked },
  });

  res.json({
    success: true,
    data: available,
  });
};