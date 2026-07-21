const qualityService = require("../services/qualityService");
const listingService = require("../services/listingService");

/**
 * Get quality score for a specific listing
 */
const getListingQuality = async (req, res) => {
    try {
        const { id } = req.params;
        const quality = await qualityService.getListingQuality(id, req.user.id);

        if (!quality) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or you don't have permission.",
            });
        }

        return res.status(200).json({
            success: true,
            data: quality,
        });
    } catch (error) {
        console.error("Get listing quality error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get listing quality.",
        });
    }
};

/**
 * Get seller health score
 */
const getSellerHealth = async (req, res) => {
    try {
        const health = await qualityService.calculateSellerHealth(req.user.id);

        return res.status(200).json({
            success: true,
            data: health,
        });
    } catch (error) {
        console.error("Get seller health error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get seller health.",
        });
    }
};

/**
 * Mark listing as sold
 */
const markAsSold = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify listing belongs to user and is published
        const listing = await listingService.getById(id);
        if (!listing || !listing.data) {
            return res.status(404).json({
                success: false,
                message: "Listing not found.",
            });
        }

        if (listing.data.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to mark this listing as sold.",
            });
        }

        if (listing.data.status !== "published") {
            return res.status(400).json({
                success: false,
                message: "Only published listings can be marked as sold.",
            });
        }

        // Update listing status to sold
        const result = await pool.query(
            `UPDATE listings SET status = 'sold', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Listing marked as sold! 🎉",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Mark as sold error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark listing as sold.",
        });
    }
};

/**
 * Renew listing
 */
const renewListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify listing belongs to user
        const listing = await listingService.getById(id);
        if (!listing || !listing.data) {
            return res.status(404).json({
                success: false,
                message: "Listing not found.",
            });
        }

        if (listing.data.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to renew this listing.",
            });
        }

        // Update listing with new timestamps
        const result = await pool.query(
            `UPDATE listings SET 
                updated_at = CURRENT_TIMESTAMP, 
                published_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Listing renewed! It's back at the top.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Renew listing error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to renew listing.",
        });
    }
};

module.exports = {
    getListingQuality,
    getSellerHealth,
    markAsSold,
    renewListing,
};