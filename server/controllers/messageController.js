const Message = require("../models/Message");
const Property = require("../models/Property");

exports.contactOwner = async (req, res) => {
  try {
    const tenantId = req.user.id; // from auth middleware
    const { propertyId, subject, message } = req.body;

    // 1. Validate input
    if (!propertyId || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Find property
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 3. Get owner from property
    const ownerId = property.owner;

    // 4. Create message
    const newMessage = await Message.create({
      sender: tenantId,
      receiver: ownerId,
      property: propertyId,
      subject,
      message,
      type: "tenant-to-owner",
    });

    res.status(201).json({
      success: true,
      message: "Message sent to owner",
      data: newMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOwnerMessages = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.user.id;

    const messages = await Message.find({ receiver: ownerId })
      .populate("sender", "fullname email")
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};