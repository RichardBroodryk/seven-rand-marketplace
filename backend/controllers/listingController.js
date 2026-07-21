const listingService = require("../services/listingService");

const create = async (req, res) => {
    try {
        // Debug logs
        console.log("🔵 [CONTROLLER] Request body:", JSON.stringify(req.body, null, 2));
        console.log("🔵 [CONTROLLER] User from JWT:", req.user ? JSON.stringify(req.user, null, 2) : "No user");

        const result = await listingService.create(req.body, req.user);

        return res.status(201).json(result);
    } catch (error) {
        console.log("🔴 [CONTROLLER] Error:", error.message);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const latest = async (req, res) => {
    try {
        const result = await listingService.latest();

        return res.status(200).json(result);
    } catch (error) {
        console.log("🔴 [CONTROLLER] Latest error:", error.message);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔵 [CONTROLLER] Get listing by ID:", id);

        const result = await listingService.getById(id);

        return res.status(200).json(result);
    } catch (error) {
        console.log("🔴 [CONTROLLER] Get by ID error:", error.message);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const publish = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔵 [CONTROLLER] Publish listing:", id);

        const result = await listingService.publishListing(id);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.log("🔴 [CONTROLLER] Publish error:", error.message);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMyListings = async (req, res) => {
    try {
        const {
            limit = 20,
            offset = 0,
            status = "all",
            sort_by = "newest",
        } = req.query;

        const result = await listingService.getSellerListings(req.user.id, {
            limit: Number(limit),
            offset: Number(offset),
            status,
            sort_by,
        });

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: {
                total: result.total,
                limit: result.limit,
                offset: result.offset,
                hasMore: result.hasMore,
            },
        });
    } catch (error) {
        console.error("🔴 Get my listings error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your listings.",
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await listingService.updateListing(id, req.user.id, updateData);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or you don't have permission.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Listing updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("🔴 Update listing error:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update listing.",
        });
    }
};

const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await listingService.deleteListing(id, req.user.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or you don't have permission.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully.",
        });
    } catch (error) {
        console.error("🔴 Delete listing error:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete listing.",
        });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await listingService.getListingStats(req.user.id);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("🔴 Get stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch stats.",
        });
    }
};

module.exports = {
    create,
    latest,
    getById,
    publish,
    getMyListings,
    updateListing,
    deleteListing,
    getStats,
};