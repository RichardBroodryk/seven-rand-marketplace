const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const uploadController = require("../controllers/uploadController");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only - NOW SUPPORTS iPHONE PHOTOS!
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/webp", 
    "image/gif",
    "image/heic",   // ✅ iPhone photos (new)
    "image/heif"    // ✅ iPhone photos (alternative)
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, GIF, and HEIC images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: fileFilter,
});

// Protected routes (require authentication)
router.post(
  "/single",
  authMiddleware,
  upload.single("image"),
  uploadController.uploadSingle
);

router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 5), // Max 5 images
  uploadController.uploadMultiple
);

router.delete(
  "/:publicId",
  authMiddleware,
  uploadController.deleteImage
);

module.exports = router;