const pool = require("../config/db");

const addFavourite = async (userId, listingId) => {
    const result = await pool.query(
        `
        INSERT INTO favourites (user_id, listing_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, listing_id) DO NOTHING
        RETURNING *
        `,
        [userId, listingId]
    );
    return result.rows[0] || null;
};

const removeFavourite = async (userId, listingId) => {
    const result = await pool.query(
        `
        DELETE FROM favourites
        WHERE user_id = $1 AND listing_id = $2
        RETURNING *
        `,
        [userId, listingId]
    );
    return result.rows[0] || null;
};

const getFavourites = async (userId) => {
    const result = await pool.query(
        `
        SELECT 
            l.id,
            l.user_id,
            l.category_id,
            l.title,
            l.description,
            l.price,
            l.province,
            l.city,
            l.status,
            l.views,
            l.created_at,
            l.published_at,
            c.name as category_name,
            (
                SELECT json_agg(json_build_object(
                    'id', li.id,
                    'url', li.url,
                    'display_order', li.display_order
                ) ORDER BY li.display_order ASC)
                FROM listing_images li
                WHERE li.listing_id = l.id
            ) as images,
            f.created_at as favourited_at
        FROM favourites f
        JOIN listings l ON f.listing_id = l.id
        LEFT JOIN categories c ON l.category_id = c.id
        WHERE f.user_id = $1 AND l.status = 'published'
        ORDER BY f.created_at DESC
        `,
        [userId]
    );
    return result.rows;
};

const isFavourite = async (userId, listingId) => {
    const result = await pool.query(
        `
        SELECT EXISTS (
            SELECT 1 FROM favourites
            WHERE user_id = $1 AND listing_id = $2
        ) as is_favourite
        `,
        [userId, listingId]
    );
    return result.rows[0].is_favourite;
};

module.exports = {
    addFavourite,
    removeFavourite,
    getFavourites,
    isFavourite,
};