const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const { 
    createSupportRequest,
getAllSupportRequests,
updateSupportStatus, } = require("../controllers/supportController");


// public route (no login needed)
router.post("/support", createSupportRequest);
router.get("/",authMiddleware,getAllSupportRequests);
router.put("/support/:id", updateSupportStatus);



module.exports = router;
