const Booking = require("../models/Booking");
const AmenityBooking = require("../models/AmenityBooking");
const Property = require("../models/Property")
const mongoose = require("mongoose");

exports.getTenants = async (req, res) => {
  try {
    
    // 1 Fetch bookings
    const bookings = await Booking.find()
      .populate("user", "fullname email phone profileImage")
      .populate("property", "title address");
      

    // 2 Fetch all amenity bookings
    const amenityBookings = await AmenityBooking.find()
      .populate("amenity", "name")
      .populate("user", "_id");

    // 3 Group amenities by user
    const amenitiesByUser = {};

    amenityBookings.forEach((a) => {
      const userId = a.user?._id?.toString();
      if (!userId) return;

      if (!amenitiesByUser[userId]) {
        amenitiesByUser[userId] = [];
      }

      amenitiesByUser[userId].push({
        id: a._id,
        name: a.amenity?.name,
        status: a.status,
        date: a.date,
      });
    });

    const today = new Date();

    // 4 Filter confirmed bookings
    const validBookings = bookings;

    // 5 Map tenants
    const tenants = validBookings.map((b) => {
      // console.log("PROPERTY:", b.property);
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);

      let status = "upcoming";
      if (start <= today && end >= today) status = "active";
      else if (end < today) status = "expired";

      const userId = b.user?._id?.toString();

      return {
        _id: userId,

        // user info
        name: b.user?.fullname,
        email: b.user?.email,
        phone: b.user?.phone,
        profileImage: b.user?.profileImage,

        // property info
        property: b.property?.title || "N/A",
        address: b.property?.address || "N/A",
        unit: b.unit || "N/A",

        //  lease
        leaseStart: b.startDate,
        leaseEnd: b.endDate,

        //  rent
        rentAmount: b.rentAmount,
        deposit: b.deposit,

        status,

        //  amenities
        amenities: amenitiesByUser[userId] || [],
      };
    });

    // 6 Remove duplicate tenants
    const uniqueTenants = Object.values(
      tenants.reduce((acc, tenant) => {
        if (tenant._id) {
          acc[tenant._id] = tenant;
        }
        return acc;
      }, {}),
    );

    // 7 Counts
    const counts = {
      total: uniqueTenants.length,
      active: 0,
      expired: 0,
      upcoming: 0,
    };

    uniqueTenants.forEach((t) => {
      counts[t.status]++;
    });

    // 8 Response
    res.json({
      tenants: uniqueTenants,
      counts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// controllers/ownerController.js

exports.getOwnerTenants = async (req, res) => {
  try {
  const ownerId = new mongoose.Types.ObjectId(req.user.id);

    // const bookings = await Booking.find()
    //   .populate({
    //     path: "property",
    //     match: { owner: ownerId }, 
    //     select: "title",
    //   })
    //   .populate("user", "fullname email phone");
    // console.log(bookings);  

    const bookings = await Booking.find()
      .populate("property", "title owner")
      .populate("user", "fullname email phone");

    // filter manually
    const filtered = bookings.filter(
      (b) =>
        b.property &&
        b.property.owner &&
        b.property.title &&
        b.property.owner.toString() === req.user.id,
        
    );

    // console.log(filtered);

    

    // // remove bookings where property is null (not owner's)
    // const filtered = bookings.filter((b) => b.property !== null);

    // extract unique tenants
    const tenantsMap = new Map();
    const today = new Date();

    filtered.forEach((b) => {
       if (!b.property) return;

       let status = "expired";

       if (today < b.startDate) {
         status = "upcoming";
       } else if (today >= b.startDate && today <= b.endDate) {
         status = "active";
       }

      if (b.user) {
        tenantsMap.set(b.user._id.toString(), {
          _id: b.user._id,
          name: b.user?.fullname || "N/A",
          email: b.user?.email || "",
          phone: b.user?.phone || "",
          property: b.property?.title || "",
          propertyId: b.property?._id,
          leaseStart: b.startDate,
          leaseEnd: b.endDate,
          rentAmount: b.rentAmount,
          status,
        });
      }
    });

    const tenants = Array.from(tenantsMap.values());

    res.json({
      success: true,
      tenants,
    });
  } catch (err) {
    console.log("Error",err.res?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
};