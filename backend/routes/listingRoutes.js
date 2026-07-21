const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const listingController = require("../controllers/listingController");

// Public routes
router.get("/latest", listingController.latest);
router.get("/:id", listingController.getById);

// Protected routes (require authentication)
router.post("/", authMiddleware, listingController.create);
router.get("/my/listings", authMiddleware, listingController.getMyListings);
router.get("/my/stats", authMiddleware, listingController.getStats);
router.put("/:id", authMiddleware, listingController.updateListing);
router.delete("/:id", authMiddleware, listingController.deleteListing);
router.put("/:id/publish", authMiddleware, listingController.publish);

module.exports = router;