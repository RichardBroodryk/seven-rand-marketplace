const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get("/:slug/listings", categoryController.getListingsByCategory);

module.exports = router;