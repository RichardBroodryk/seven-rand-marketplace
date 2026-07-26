const cloudinaryService = require("../services/cloudinaryService");
const pool = require("../config/db");

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
 * Upload multiple images - ✅ NOW SAVES TO DATABASE
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

    // ✅ Save images to the database with a NULL listing_id for now
    const savedImages = [];
    
    for (const image of images) {
      const listingId = req.body.listingId || null;
      
      const result = await pool.query(
        `INSERT INTO listing_images (listing_id, url, public_id, display_order) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [listingId, image.url, image.publicId, 0]
      );
      
      savedImages.push({
        id: result.rows[0].id,
        ...image,
      });
    }

    return res.status(200).json({
      success: true,
      data: savedImages,
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
 * ✅ Link uploaded images to a listing
 */
const linkImagesToListing = async (req, res) => {
  try {
    const { listingId, imageIds } = req.body;

    if (!listingId || !imageIds || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Listing ID and image IDs are required.",
      });
    }

    // Verify the listing belongs to the user
    const listingCheck = await pool.query(
      `SELECT id FROM listings WHERE id = $1 AND user_id = $2`,
      [listingId, req.user.id]
    );

    if (listingCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to link images to this listing.",
      });
    }

    // Update the images with the listing_id
    const result = await pool.query(
      `UPDATE listing_images 
       SET listing_id = $1 
       WHERE id = ANY($2::uuid[]) 
       RETURNING id, url`,
      [listingId, imageIds]
    );

    return res.status(200).json({
      success: true,
      message: `${result.rows.length} images linked to listing.`,
      data: result.rows,
    });
  } catch (error) {
    console.error("Link images error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to link images.",
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

    // Delete from Cloudinary
    const result = await cloudinaryService.deleteImage(publicId);

    // ✅ Delete from database as well
    await pool.query(
      `DELETE FROM listing_images WHERE public_id = $1`,
      [publicId]
    );

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
  linkImagesToListing, // ✅ New export
  deleteImage,
};