const favouriteService = require("../services/favouriteService");

const addFavourite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const result = await favouriteService.addFavourite(req.user.id, listingId);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Listing already in favourites.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Added to favourites! ❤️",
        });
    } catch (error) {
        console.error("Add favourite error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to favourites.",
        });
    }
};

const removeFavourite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const result = await favouriteService.removeFavourite(req.user.id, listingId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Listing not in favourites.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Removed from favourites.",
        });
    } catch (error) {
        console.error("Remove favourite error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from favourites.",
        });
    }
};

const getFavourites = async (req, res) => {
    try {
        const favourites = await favouriteService.getFavourites(req.user.id);

        return res.status(200).json({
            success: true,
            data: favourites,
        });
    } catch (error) {
        console.error("Get favourites error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get favourites.",
        });
    }
};

const isFavourite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const isFav = await favouriteService.isFavourite(req.user.id, listingId);

        return res.status(200).json({
            success: true,
            data: { is_favourite: isFav },
        });
    } catch (error) {
        console.error("Check favourite error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check favourite.",
        });
    }
};

module.exports = {
    addFavourite,
    removeFavourite,
    getFavourites,
    isFavourite,
};