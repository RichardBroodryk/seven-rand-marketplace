const pool = require("../config/db");

const create = async ({ listing_id, url, public_id, display_order = 0 }) => {
    const result = await pool.query(
        `
        INSERT INTO listing_images (listing_id, url, public_id, display_order)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [listing_id, url, public_id, display_order]
    );
    return result.rows[0];
};

const createMultiple = async (images) => {
    if (!images || images.length === 0) return [];

    const values = images.map(
        (_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
    ).join(", ");

    const params = images.flatMap((img) => [
        img.listing_id,
        img.url,
        img.public_id,
        img.display_order || 0,
    ]);

    const query = `
        INSERT INTO listing_images (listing_id, url, public_id, display_order)
        VALUES ${values}
        RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows;
};

const findByListingId = async (listingId) => {
    const result = await pool.query(
        `
        SELECT * FROM listing_images
        WHERE listing_id = $1
        ORDER BY display_order ASC, created_at ASC
        `,
        [listingId]
    );
    return result.rows;
};

const deleteByListingId = async (listingId) => {
    const result = await pool.query(
        `
        DELETE FROM listing_images
        WHERE listing_id = $1
        RETURNING public_id
        `,
        [listingId]
    );
    return result.rows;
};

const deleteById = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM listing_images
        WHERE id = $1
        RETURNING public_id
        `,
        [id]
    );
    return result.rows[0] || null;
};

module.exports = {
    create,
    createMultiple,
    findByListingId,
    deleteByListingId,
    deleteById,
};