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
