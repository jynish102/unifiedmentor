const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");
const User = require("../models/User");
const Amenity = require("../models/Amenity");
const mongoose = require("mongoose");

// CREATE MAINTENANCE REQUEST
exports.createMaintenance = async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const propertyId = req.body.property;
    const amenityId = req.body.amenity;
    const userId = req.user._id || req.user.id;

    //  Both not allowed
    if (propertyId && amenityId) {
      return res.status(400).json({
        message: "Provide either property OR amenity, not both",
      });
    }

    // At least one required
    if (!propertyId && !amenityId) {
      return res.status(400).json({
        message: "Property or Amenity is required",
      });
    }

    //  Validate property
    if (propertyId) {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
    }

    // Validate amenity
    if (amenityId) {
      if (!mongoose.Types.ObjectId.isValid(amenityId)) {
        return res.status(400).json({ message: "Invalid amenity ID" });
      }

      const amenity = await Amenity.findById(amenityId);
      if (!amenity) {
        return res.status(404).json({ message: "Amenity not found" });
      }
    }

    // Create maintenance with tracking
    const maintenance = new Maintenance({
      property: propertyId || null,
      amenity: amenityId || null,
      tenant: userId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: "pending",

      //  Tracking start
      updates: [
        {
          message: "Maintenance request created",
          status: "pending",
          updatedBy: userId,
        },
      ],
    });

    await maintenance.save();

    res.status(201).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL MAINTENANCE REQUESTS
exports.getAllMaintenance = async (req, res) => {
  const maintenance = await Maintenance.aggregate([
    // Priority logic
    {
      $addFields: {
        priorityValue: {
          $switch: {
            branches: [
              { case: { $eq: ["$priority", "emergency"] }, then: 4 },
              { case: { $eq: ["$priority", "high"] }, then: 3 },
              { case: { $eq: ["$priority", "medium"] }, then: 2 },
              { case: { $eq: ["$priority", "low"] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },

    // Sort
    { $sort: { priorityValue: -1 } },

    // JOIN Property
    {
      $lookup: {
        from: "properties", // collection name in MongoDB
        localField: "property", // field in Maintenance
        foreignField: "_id", // field in Property
        as: "property",
      },
    },

    // convert array → object
    { $unwind: "$property" },

    // JOIN Tenant (User)
    {
      $lookup: {
        from: "users", // User collection
        localField: "tenant",
        foreignField: "_id",
        as: "tenant",
      },
    },

    // convert array → object
    { $unwind: "$tenant" },
  ]);

  res.json({
    success: true,
    data: maintenance,
  });
};

// GET MAINTENANCE BY PROPERTY
exports.getMaintenanceByProperty = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { propertyId } = req.params;

    //  1. Check property exists & belongs to owner
    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(403).json({
        message: "Not authorized for this property",
      });
    }

    // 2. Get maintenance for that property
    const maintenance = await Maintenance.find({
      property: propertyId,
    })
      .populate("tenant", "fullname email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET MAINTENANCE BY TENANT
exports.getTenantMaintenance = async (req, res) => {
  const maintenance = await Maintenance.find({
    tenant: req.params.tenantId,
  });

  res.json({
    success: true,
    data: maintenance,
  });
};

//owner  maintenance requests
exports.getOwnerMaintenance = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;

    // 1 Get owner properties
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map((p) => p._id);

    // 2 Get amenities of those properties
    const amenities = await Amenity.find({
      property: { $in: propertyIds },
    });

    const amenityIds = amenities.map((a) => a._id);

    // 3 Fetch maintenance (property OR amenity)
    const maintenance = await Maintenance.find({
      $or: [
        { property: { $in: propertyIds } },
        { amenity: { $in: amenityIds } },
      ],
    })
      .populate("tenant", "fullname email")
      .populate("property", "title address")
      .populate("amenity", "name")
      .populate("assignedTo", "fullname email") 
      .populate("updates.updatedBy", "fullname")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getMyMaintenance = async (req, res) => {
  try {
    // Get logged-in tenant ID from token
    const tenantId = req.user._id || req.user.id;

    //  Safety check
    if (!tenantId) {
      return res.status(401).json({
        message: "Unauthorized - user not found",
      });
    }

    // Fetch maintenance requests
    const maintenance = await Maintenance.find({
      tenant: tenantId,
    })
      .populate("property", "title address city") // show property info
      .populate("amenity", "name location " )
      .sort({ createdAt: -1 }); // latest first
    console.log(JSON.stringify(maintenance, null, 2));

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error("GET MY MAINTENANCE ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE MAINTENANCE STATUS
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id || req.user.id;

    // 1. Find maintenance
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    let isAuthorized = false;

    // 2. If property-based maintenance
    if (maintenance.property) {
      const property = await Property.findById(maintenance.property);

      if (property && property.owner.toString() === userId.toString()) {
        isAuthorized = true;
      }
    }

    // 3. If amenity-based maintenance
    if (maintenance.amenity) {
      const amenity = await Amenity.findById(maintenance.amenity);

      if (amenity) {
        const property = await Property.findById(amenity.property);

        if (property && property.owner.toString() === userId.toString()) {
          isAuthorized = true;
        }
      }
    }

    // 4. Final check
    if (!isAuthorized) {
      return res.status(403).json({
        message: "Not authorized to update this maintenance",
      });
    }

    // 5. Update status
    maintenance.status = status;
    await maintenance.save();

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//assign maintenance to staff
exports.assignMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const ownerId = req.user._id || req.user.id;

    // 1. Check maintenance exists
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance not found",
      });
    }

    // 2. Get property (for authorization)
    let propertyId = maintenance.property;

    // If maintenance is for amenity → get property from amenity
    if (!propertyId && maintenance.amenity) {
      const amenity = await Amenity.findById(maintenance.amenity);
      propertyId = amenity?.property;
    }

    // 3. Check owner owns this property
    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 4. Validate staff user
    const staffUser = await User.findById(assignedTo);

    if (!staffUser) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    // (Optional) check role
    if (staffUser.role !== "staff") {
      return res.status(400).json({
        message: "User is not staff",
      });
    }

    // 5. Assign
    maintenance.assignedTo = assignedTo;

    // 6. Add update log
    maintenance.updates.push({
      message: "Assigned to staff",
      status: "pending",
      updatedBy: ownerId,
    });

    await maintenance.save();

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE MAINTENANCE REQUEST
exports.deleteMaintenance = async (req, res) => {
  await Maintenance.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Maintenance request deleted",
  });
};
