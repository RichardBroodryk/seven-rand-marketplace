const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const uploadController = require("../controllers/uploadController");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only - NOW SUPPORTS iPHONE PHOTOS!
const fileFilter = (req, file, cb) => {
  // Check if it's an image based on the magic bytes, not just the mimetype
  const allowedTypes = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/webp", 
    "image/gif",
    "image/heic",
    "image/heif",
    "application/octet-stream" // ✅ Mobile browsers sometimes send this
  ];
  
  // Also accept if the file name ends with a valid image extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'];
  const fileName = file.originalname.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (allowedTypes.includes(file.mimetype) || hasValidExtension) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
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