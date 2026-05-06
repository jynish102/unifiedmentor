const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { contactOwner,
    contactTenant,
    getOwnerMessages,
    getTenantMessages
} = require("../controllers/messageController");


router.post("/contact-owner", authMiddleware,authorizeRoles("tenant") , contactOwner);
router.post("/contact-tenant", authMiddleware, authorizeRoles("owner"), contactTenant);
router.get("/owner", authMiddleware,authorizeRoles("owner") , getOwnerMessages);
router.get("/tenant", authMiddleware,authorizeRoles("tenant") , getTenantMessages);



module.exports = router;
