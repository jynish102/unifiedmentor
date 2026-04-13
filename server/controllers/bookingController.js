const Booking = require("../models/Booking");
const Property = require("../models/Property");
const User = require("../models/User");


// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    // console.log("PROPERTY ID:", req.body.property);
    const property = await Property.findById(req.body.property);
    // const user = await User.findById(req.body.user);
    // console.log("USER:", req.user);
    // const { unitsRequested } = req.body;
    // const available = property.units - property.occupied;

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (!req.body.property) {
      return res.status(400).json({
        message: "Property ID is required",
      });
    }

    if (property.listingType !== "rent") {
      return res.status(400).json({
        message: "Booking is only allowed for rental properties",
      });
    }

    if (property.occupied >= property.units) {
      return res.status(400).json({
        message: "No units available",
      });
    }

   

    const {  startDate, endDate, rentAmount } = req.body;
    

    // Check if property already booked for these dates
    const existingBooking = await Booking.findOne({
      property: property._id,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
          
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Property already booked for selected dates",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Dates are required",
      });
    }

    const booking = new Booking({
      property: property._id,
      user: req.user.id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      rentAmount: req.body.rentAmount,
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

// GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("property", "title address price")
    .populate("user", "fullname email");

  res.json({
    success: true,
    data: bookings,
  });
};

// GET BOOKING BY USER
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user.id,
  }).populate("property", "title address ");

  res.json({
    success: true,
    data: bookings,
  });
};

// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  res.json({
    success: true,
    data: booking,
  });
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    message: "Booking deleted",
  });
};

//Available properties for given dates
exports.getAvailableProperties = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Step 1: find booked properties
  const booked = await Booking.find({
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  }).distinct("property");

  // Step 2: find NOT booked
  const available = await Property.find({
    _id: { $nin: booked },
  });

  res.json({
    success: true,
    data: available,
  });
};
