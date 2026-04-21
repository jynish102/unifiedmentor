const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfileData, updateProfileData } = require("../controllers/profileController.js");

router.get("/profile-data", authMiddleware, getProfileData);
router.put("/update-profile-data", authMiddleware, updateProfileData);

module.exports = router;
