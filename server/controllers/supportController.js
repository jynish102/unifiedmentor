const SupportRequest = require("../models/SupportRequest");

exports.createSupportRequest = async (req, res) => {
  try {
    const data = req.body;

    const request = await SupportRequest.create(data);

    res.status(201).json({
      message: "Support request submitted successfully",
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit request" });
  }
};


// controller
exports.getAllSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });

    res.json({ data: requests });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

exports.updateSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SupportRequest.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true },
    );

    res.json({ message: "Marked as resolved", data: request });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};