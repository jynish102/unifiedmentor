const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const { getTenants,
    getOwnerTenants
 } = require("../controllers/tenantController");

router.get("/admin", authMiddleware ,authorizeRoles("admin") , getTenants);
router.get("/owner", authMiddleware, authorizeRoles("owner") , getOwnerTenants);
module.exports = router;
