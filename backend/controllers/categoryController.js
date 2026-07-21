const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("Get categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories.",
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("Get category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category.",
        });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlug(slug);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("Get category by slug error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category.",
        });
    }
};

const getListingsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const {
            limit = 20,
            offset = 0,
            sort_by = "newest",
            min_price,
            max_price,
            province,
            city,
        } = req.query;

        // Get category by slug first
        const category = await categoryService.getCategoryBySlug(slug);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        const result = await categoryService.getListingsByCategory(category.id, {
            limit: Number(limit),
            offset: Number(offset),
            sort_by,
            min_price: min_price ? Number(min_price) : undefined,
            max_price: max_price ? Number(max_price) : undefined,
            province,
            city,
        });

        return res.status(200).json({
            success: true,
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                is_premium: category.is_premium,
            },
            data: result.data,
            pagination: {
                total: result.total,
                limit: result.limit,
                offset: result.offset,
                hasMore: result.hasMore,
            },
        });
    } catch (error) {
        console.error("Get category listings error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category listings.",
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getListingsByCategory,
};