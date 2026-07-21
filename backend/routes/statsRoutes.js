const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Public route
router.get("/marketplace", statsController.getMarketplaceStats);

module.exports = router;