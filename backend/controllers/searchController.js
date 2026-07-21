const searchService = require("../services/searchService");

const search = async (req, res) => {
    try {
        const {
            keyword,
            category_id,
            province,
            city,
            min_price,
            max_price,
            limit = 20,
            offset = 0,
            sort_by = "relevance",
        } = req.query;

        const result = await searchService.searchListings({
            keyword,
            category_id: category_id ? Number(category_id) : undefined,
            province,
            city,
            min_price: min_price ? Number(min_price) : undefined,
            max_price: max_price ? Number(max_price) : undefined,
            limit: Number(limit),
            offset: Number(offset),
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
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to perform search.",
            error: error.message,
        });
    }
};

module.exports = {
    search,
};