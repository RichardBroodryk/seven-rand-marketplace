const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const favouriteController = require("../controllers/favouriteController");

// All favourite routes require authentication
router.get("/", authMiddleware, favouriteController.getFavourites);
router.get("/:listingId", authMiddleware, favouriteController.isFavourite);
router.post("/:listingId", authMiddleware, favouriteController.addFavourite);
router.delete("/:listingId", authMiddleware, favouriteController.removeFavourite);

module.exports = router;