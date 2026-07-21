const pool = require("../config/db");

const searchListings = async (filters) => {
    const {
        keyword,
        category_id,
        province,
        city,
        min_price,
        max_price,
        limit = 20,
        offset = 0,
        sort_by = "relevance", // relevance, price_asc, price_desc, newest
    } = filters;

    // Build the query conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Only show published listings
    conditions.push(`l.status = 'published'`);

    // Keyword search (title and description)
    if (keyword && keyword.trim()) {
        conditions.push(`(l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex})`);
        params.push(`%${keyword.trim()}%`);
        paramIndex++;
    }

    // Category filter
    if (category_id) {
        conditions.push(`l.category_id = $${paramIndex}`);
        params.push(category_id);
        paramIndex++;
    }

    // Province filter
    if (province && province.trim()) {
        conditions.push(`l.province ILIKE $${paramIndex}`);
        params.push(`%${province.trim()}%`);
        paramIndex++;
    }

    // City filter
    if (city && city.trim()) {
        conditions.push(`l.city ILIKE $${paramIndex}`);
        params.push(`%${city.trim()}%`);
        paramIndex++;
    }

    // Price range filters
    if (min_price && !isNaN(min_price)) {
        conditions.push(`l.price >= $${paramIndex}`);
        params.push(Number(min_price));
        paramIndex++;
    }

    if (max_price && !isNaN(max_price)) {
        conditions.push(`l.price <= $${paramIndex}`);
        params.push(Number(max_price));
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Build sort order
    let orderClause = "";
    switch (sort_by) {
        case "price_asc":
            orderClause = "ORDER BY l.price ASC";
            break;
        case "price_desc":
            orderClause = "ORDER BY l.price DESC";
            break;
        case "newest":
            orderClause = "ORDER BY l.published_at DESC NULLS LAST, l.created_at DESC";
            break;
        case "relevance":
        default:
            orderClause = "ORDER BY l.published_at DESC NULLS LAST, l.created_at DESC";
            break;
    }

    // Count total results
    const countQuery = `
        SELECT COUNT(*) as total
        FROM listings l
        ${whereClause}
    `;

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Main query with pagination
    const query = `
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
            u.first_name as seller_first_name,
            u.last_name as seller_last_name,
            u.is_verified as seller_verified,
            u.reputation_score as seller_reputation,
            (
                SELECT json_agg(json_build_object(
                    'id', li.id,
                    'url', li.url,
                    'display_order', li.display_order
                ) ORDER BY li.display_order ASC)
                FROM listing_images li
                WHERE li.listing_id = l.id
            ) as images
        FROM listings l
        LEFT JOIN categories c ON l.category_id = c.id
        LEFT JOIN users u ON l.user_id = u.id
        ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
        data: result.rows,
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: offset + result.rows.length < total,
    };
};

module.exports = {
    searchListings,
};