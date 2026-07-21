const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const qualityController = require("../controllers/qualityController");

// All quality routes require authentication
router.get("/listing/:id/quality", authMiddleware, qualityController.getListingQuality);
router.get("/health", authMiddleware, qualityController.getSellerHealth);
router.put("/listing/:id/sold", authMiddleware, qualityController.markAsSold);
router.put("/listing/:id/renew", authMiddleware, qualityController.renewListing);

module.exports = router;