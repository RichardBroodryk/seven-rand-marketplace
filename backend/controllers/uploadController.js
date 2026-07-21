const cloudinaryService = require("../services/cloudinaryService");

/**
 * Upload single image
 */
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const result = await cloudinaryService.uploadImage(
      req.file.buffer,
      "listings",
      { public_id: `listing_${Date.now()}` }
    );

    return res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image.",
      error: error.message,
    });
  }
};

/**
 * Upload multiple images
 */
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided.",
      });
    }

    const buffers = req.files.map((file) => file.buffer);
    const results = await cloudinaryService.uploadMultipleImages(
      buffers,
      "listings"
    );

    const images = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }));

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload images.",
      error: error.message,
    });
  }
};

/**
 * Delete image
 */
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID required.",
      });
    }

    const result = await cloudinaryService.deleteImage(publicId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteImage,
};