const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const { 
    createStaff,
    getMyStaff
 } = require("../controllers/userController");

router.post("/add", authMiddleware, authorizeRoles("owner"), createStaff);
router.get("/my-staff", authMiddleware, authorizeRoles("owner"), getMyStaff);

module.exports = router;
