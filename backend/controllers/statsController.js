const statsService = require("../services/statsService");

const getMarketplaceStats = async (req, res) => {
    try {
        const stats = await statsService.getMarketplaceStats();
        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Get stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch marketplace stats.",
        });
    }
};

module.exports = {
    getMarketplaceStats,
};