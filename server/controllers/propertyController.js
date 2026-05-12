const Property = require("../models/Property");
const mongoose = require("mongoose");
const Notification = require("../models/Notifications")
const User = require("../models/user");

exports.addProperty = async (req, res) => {
  try {
    // console.log("BODY:", req.user);
    // console.log("FILES:", req.files);
    const imagePaths = req.files?.map((file) => file.path) || [];
    const admin = await User.findOne({ role: "admin" });
    const currentUser = await User.findById(req.user.id);
    
    if (req.body.occupied > req.body.units) {
      return res.status(400).json({
        message: "Occupied cannot be greater than total units",
      });
    }

    const property = await Property.create({
      ...req.body,
      images: imagePaths,
      owner: req.user.id,
      approvalStatus: "pending",
    });

    if(admin){
    await Notification.create({
      user: admin._id,
      title: "New Property Request",
      message: `${currentUser.fullname} added a new property`,
      type: "property-request",

      relatedId: property._id,
      relatedModel: "Property",

      redirectUrl: `/admin/properties-requests`,
    });
  }


    res.status(201).json({
      message: "Property request submitted for admin approval",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get property Request
exports.getPropertyRequests = async (req, res) => {
  try {
    
    const properties = await Property.find({
      approvalStatus: "pending",
    })
      .populate("owner", "fullname email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//update Approval Status
exports.updateApprovalStatus = async (req, res) => {
  try {
    // only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { approvalStatus } = req.body;

    if (!["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    property.approvalStatus = approvalStatus;
    property.approvedAt = new Date();

    await property.save();
    await Notification.create({
      user: property.owner,

      title:
        approvalStatus === "approved"
          ? "Property Approved"
          : "Property Rejected",

      message:
        approvalStatus === "approved"
          ? `${property.title} has been approved by admin`
          : `${property.title} has been rejected by admin`,

      type:
        approvalStatus === "approved"
          ? "property-approved"
          : "property-rejected",

      relatedId: property._id,
      relatedModel: "Property",

      redirectUrl: "/owner/properties",
    });


    res.status(200).json({
      success: true,
      message: `Property ${approvalStatus} successfully`,
      data: property,
    });
  } catch (err) {
    console.log(err.res?.data || err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//Get Properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({approvalStatus : "approved"}).populate(
      "owner",
      "fullname email",
     
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getPropertyById = async (req, res) => {
//   try {
//     const user = req.user;
//     const propertyId = req.params.id;

//     // Only fetch if property belongs to owner
//     const property = await Property.findOne({
//       _id: propertyId,
//       user: user.id,
//     });

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found or not authorized",
//       });
//     }

//     res.json(property);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//owner specific all properties
// GET owner properties
exports.getMyProperties = async (req, res) => {
  try {
    //  await Property.updateMany(
    //    { approvalStatus: { $exists: false } },
    //    {
    //      $set: {
    //        approvalStatus: "approved",
    //      },
    //    },
    //  );
    const ownerId = req.user.id;
    // console.log("USER:", req.user);

    // console.log("TOKEN ID:", req.user.id);
    // console.log("DB OWNER SAMPLE:", (await Property.findOne()).owner);

    const properties = await Property.find({
      owner: ownerId,
      
    });

    res.json({
      success: true,
      data: properties,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update Property
exports.updateProperty = async (req, res) => {
  try {
      const fs = require("fs");
      const path = require("path");
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Admin OR property owner
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    const existingImages = JSON.parse(req.body.existingImages || "[]");
    const imagesToDelete = property.images.filter(
      (img) => !existingImages.includes(img),
    );
    imagesToDelete.forEach((img) => {
      const filePath = path.join(__dirname, "..", img);
      fs.unlink(filePath, (err) => {
        if (err) console.log("Error deleting file:", err);
      });
    });

    const updateData = { ...req.body };
    if (req.body.amenities) {
      updateData.amenities = JSON.parse(req.body.amenities);
    }

  
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.path);
    }

    // FINAL IMAGES = remaining old + new uploads
    updateData.images = [...existingImages, ...newImages];

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );

    res.json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Property

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

