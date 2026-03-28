const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/authorizeRoles");

router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin Dashboard Data" });
});

module.exports = router;
