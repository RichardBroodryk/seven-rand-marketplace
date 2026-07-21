const savedSearchService = require("../services/savedSearchService");

const saveSearch = async (req, res) => {
    try {
        const result = await savedSearchService.saveSearch(req.user.id, req.body);

        return res.status(201).json({
            success: true,
            message: "Search saved! 🔍",
            data: result,
        });
    } catch (error) {
        console.error("Save search error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save search.",
        });
    }
};

const getSavedSearches = async (req, res) => {
    try {
        const searches = await savedSearchService.getSavedSearches(req.user.id);

        return res.status(200).json({
            success: true,
            data: searches,
        });
    } catch (error) {
        console.error("Get saved searches error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get saved searches.",
        });
    }
};

const deleteSavedSearch = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await savedSearchService.deleteSavedSearch(req.user.id, id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Saved search not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Search removed.",
        });
    } catch (error) {
        console.error("Delete saved search error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete saved search.",
        });
    }
};

module.exports = {
    saveSearch,
    getSavedSearches,
    deleteSavedSearch,
};