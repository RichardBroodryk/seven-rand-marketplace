const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Folder name in Cloudinary
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadImage = async (buffer, folder = "listings", options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `seven-rand-marketplace/${folder}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto:good" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple images
 * @param {Array<Buffer>} buffers - Array of image buffers
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array<object>>} - Array of upload results
 */
const uploadMultipleImages = async (buffers, folder = "listings") => {
  const uploadPromises = buffers.map((buffer) => uploadImage(buffer, folder));
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Delete multiple images
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Array<object>>} - Array of deletion results
 */
const deleteMultipleImages = async (publicIds) => {
  const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
  return Promise.all(deletePromises);
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
};