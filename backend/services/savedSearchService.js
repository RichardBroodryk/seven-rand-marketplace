const pool = require("../config/db");

const saveSearch = async (userId, searchData) => {
    const {
        keyword,
        category_id,
        province,
        city,
        min_price,
        max_price,
    } = searchData;

    const result = await pool.query(
        `
        INSERT INTO saved_searches (
            user_id,
            keyword,
            category_id,
            province,
            city,
            min_price,
            max_price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [userId, keyword, category_id, province, city, min_price, max_price]
    );

    return result.rows[0];
};

const getSavedSearches = async (userId) => {
    const result = await pool.query(
        `
        SELECT * FROM saved_searches
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

const deleteSavedSearch = async (userId, searchId) => {
    const result = await pool.query(
        `
        DELETE FROM saved_searches
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [searchId, userId]
    );

    return result.rows[0] || null;
};

const checkSavedSearchMatches = async (search) => {
    // Find new listings that match this saved search
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    conditions.push(`l.status = 'published'`);

    if (search.keyword) {
        conditions.push(`(l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex})`);
        params.push(`%${search.keyword}%`);
        paramIndex++;
    }

    if (search.category_id) {
        conditions.push(`l.category_id = $${paramIndex}`);
        params.push(search.category_id);
        paramIndex++;
    }

    if (search.province) {
        conditions.push(`l.province ILIKE $${paramIndex}`);
        params.push(`%${search.province}%`);
        paramIndex++;
    }

    if (search.city) {
        conditions.push(`l.city ILIKE $${paramIndex}`);
        params.push(`%${search.city}%`);
        paramIndex++;
    }

    if (search.min_price) {
        conditions.push(`l.price >= $${paramIndex}`);
        params.push(search.min_price);
        paramIndex++;
    }

    if (search.max_price) {
        conditions.push(`l.price <= $${paramIndex}`);
        params.push(search.max_price);
        paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    const query = `
        SELECT l.id, l.title, l.price, l.province, l.city, l.created_at
        FROM listings l
        WHERE ${whereClause}
        AND l.created_at > COALESCE($${paramIndex}, '1970-01-01')
        ORDER BY l.created_at DESC
        LIMIT 10
    `;

    params.push(search.last_notified_at || '1970-01-01');

    const result = await pool.query(query, params);
    return result.rows;
};

module.exports = {
    saveSearch,
    getSavedSearches,
    deleteSavedSearch,
    checkSavedSearchMatches,
};