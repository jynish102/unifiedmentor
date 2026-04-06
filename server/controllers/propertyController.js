const Property = require("../models/Property");

exports.addProperty = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);
    const imagePaths = req.files?.map((file) => file.path) || [];

    const property = await Property.create({
      ...req.body,
      images: imagePaths,
      createdBy: req.user.id,
      
    });

    res.status(201).json({
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//Get Properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "createdBy",
      "fullname email",
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Admin OR property owner
    if (
      property.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }
    const updateData = { ...req.body };

    // ✅ HANDLE IMAGES (THIS WAS MISSING 🔥)
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);

      // 👉 Option 1: Replace all images
     // updateData.images = imagePaths;

      // 👉 Option 2 (better): Append new images
      updateData.images = [...property.images, ...imagePaths];
    }


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

