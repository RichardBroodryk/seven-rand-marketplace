const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const savedSearchController = require("../controllers/savedSearchController");

router.use(authMiddleware);

router.get("/", savedSearchController.getSavedSearches);
router.post("/", savedSearchController.saveSearch);
router.delete("/:id", savedSearchController.deleteSavedSearch);

module.exports = router;