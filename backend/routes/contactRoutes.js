const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Public routes - no authentication required
router.post("/support", contactController.contactSupport);
router.post("/resolution", contactController.resolutionCentre);
router.post("/privacy", contactController.privacyRequest);

module.exports = router;