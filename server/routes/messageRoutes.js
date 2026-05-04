const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { contactOwner,
    getOwnerMessages,
} = require("../controllers/messageController");


router.post("/contact-owner", authMiddleware, contactOwner);
router.get("/owner", authMiddleware, getOwnerMessages);

module.exports = router;
