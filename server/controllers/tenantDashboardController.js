const Booking = require("../models/Booking");
const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");
const User = require("../models/User");

exports.getTenantDashboard = async (req, res) => {
  try {
    // console.log("REQ USER:", req.user);
    const tenantId = req.user.id;
    const user = await User.findById(req.user.id).select("fullname");

    /* ---------------- BOOKINGS ---------------- */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ user: tenantId })
      .populate("property", "title address")
      .sort({ startDate: 1 });

    const upcomingBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.startDate);
      bookingDate.setHours(0, 0, 0, 0);
      return b.status === "approved" && bookingDate >= today;
    });

    // bookings.forEach((b) => {
    //   console.log("STATUS:", b.status);
    //   console.log("START:", new Date(b.startDate));
    //   console.log("NOW:", new Date());
    // });
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
      tenant: {
        fullname: user.fullname,
      },
      stats: {
        totalBookings: upcomingBookings.length,
        openMaintenance: openRequests.length,
        leaseStatus: {
          status: activeBooking ? "Active" : "Inactive",
          leaseEnd: activeBooking ? activeBooking.endDate : null,
        },
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
