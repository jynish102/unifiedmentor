const Booking = require("../models/Booking");
const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");

exports.getTenantDashboard = async (req, res) => {
  try {
    const tenantId = req.user.id;

    /* ---------------- BOOKINGS ---------------- */

    const bookings = await Booking.find({ user: tenantId })
      .populate("property", "title address")
      .sort({ startDate: 1 });

    const upcomingBookings = bookings.filter(
      (b) => b.status === "approved" && new Date(b.startDate) >= new Date(),
    );

    /* ---------------- MAINTENANCE ---------------- */

    const maintenance = await Maintenance.find({ tenant: tenantId }).sort({
      createdAt: -1,
    });

    const openRequests = maintenance.filter((m) => m.status !== "completed");

    /* ---------------- PROPERTY INFO ---------------- */

    // Get tenant's active booking (current stay)
    const activeBooking = await Booking.findOne({
      user: tenantId,
      status: "approved",
    }).populate("property");

    let propertyInfo = null;

    if (activeBooking?.property) {
      propertyInfo = {
        title: activeBooking.property.title,
        address: activeBooking.property.address,
        city: activeBooking.property.city,
        price: activeBooking.property.price,
        paymentFrequency: activeBooking.property.paymentFrequency,
      };
    }

    /* ---------------- RESPONSE ---------------- */

    res.json({
      stats: {
        totalBookings: upcomingBookings.length,
        openMaintenance: openRequests.length,
        leaseStatus: activeBooking ? "Active" : "Inactive",
      },

      bookings: upcomingBookings.slice(0, 2),

      maintenance: openRequests.slice(0, 2),

      property: propertyInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
