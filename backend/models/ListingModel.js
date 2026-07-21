const pool = require("../config/db");

const create = async ({
    user_id,
    category_id,
    title,
    description,
    price,
    province,
    city
}) => {
    const result = await pool.query(
        `
        INSERT INTO listings
        (
            user_id,
            category_id,
            title,
            description,
            price,
            province,
            city,
            status,
            payment_status
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            user_id,
            category_id,
            title,
            description,
            price,
            province,
            city,
            "pending_payment",
            "pending"
        ]
    );

    return result.rows[0];
};

const findLatest = async () => {
    const result = await pool.query(
        `
        SELECT *
        FROM listings
        WHERE status = 'published'
        ORDER BY
            published_at DESC NULLS LAST,
            created_at DESC
        LIMIT 20
        `
    );

    return result.rows;
};

const findById = async (id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM listings
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const publishListing = async (listingId) => {
    const result = await pool.query(
        `
        UPDATE listings
        SET 
            status = 'published',
            payment_status = 'paid',
            published_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND status = 'pending_payment'
        RETURNING id, title, status, published_at
        `,
        [listingId]
    );

    return result.rows[0] || null;
};

module.exports = {
    create,
    findLatest,
    findById,
    publishListing
};