const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { contactOwner,
    contactTenant,
    getOwnerMessages,
} = require("../controllers/messageController");


router.post("/contact-owner", authMiddleware, contactOwner);
router.post("/contact-tenant", authMiddleware, contactTenant);
router.get("/owner", authMiddleware, getOwnerMessages);

module.exports = router;
