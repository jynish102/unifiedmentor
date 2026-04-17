const express = require("express");
const router = express.Router();
const { getTenants } = require("../controllers/tenantController");

router.get("/", getTenants);

module.exports = router;
