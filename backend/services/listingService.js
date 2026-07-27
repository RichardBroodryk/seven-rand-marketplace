const ListingModel = require("../models/ListingModel");
const pool = require("../config/db");

const create = async (listingData, currentUser) => {
    // DEBUG: Log incoming data
    console.log("🔵 [SERVICE] Received listingData:", JSON.stringify(listingData, null, 2));
    console.log("🔵 [SERVICE] Current user:", currentUser ? JSON.stringify(currentUser, null, 2) : "No user");

    const {
        category_id,
        title,
        description,
        price,
        province,
        city
    } = listingData;

    console.log("🔵 [SERVICE] Extracted fields:", {
        category_id,
        title: title ? title.substring(0, 30) + "..." : "undefined",
        description: description ? description.substring(0, 30) + "..." : "undefined",
        price,
        province,
        city
    });

    // Check each field individually with specific messages
    if (!category_id) {
        console.log("🔴 [SERVICE] Missing: category_id");
        throw new Error("Category is required.");
    }
    if (!title || !title.trim()) {
        console.log("🔴 [SERVICE] Missing: title");
        throw new Error("Title is required.");
    }
    if (!description || !description.trim()) {
        console.log("🔴 [SERVICE] Missing: description");
        throw new Error("Description is required.");
    }
    if (!price) {
        console.log("🔴 [SERVICE] Missing: price");
        throw new Error("Price is required.");
    }
    if (!province || !province.trim()) {
        console.log("🔴 [SERVICE] Missing: province");
        throw new Error("Province is required.");
    }
    if (!city || !city.trim()) {
        console.log("🔴 [SERVICE] Missing: city");
        throw new Error("City is required.");
    }

    if (Number(price) <= 0) {
        console.log("🔴 [SERVICE] Invalid price:", price);
        throw new Error("Price must be greater than zero.");
    }

    if (!currentUser || !currentUser.id) {
        console.log("🔴 [SERVICE] Invalid user:", currentUser);
        throw new Error("User not authenticated.");
    }

    console.log("🟢 [SERVICE] All fields valid. Creating listing...");

    try {
        const listing = await ListingModel.create({
            user_id: currentUser.id,
            category_id: Number(category_id),
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            province: province.trim(),
            city: city.trim()
        });

        console.log("🟢 [SERVICE] Listing created:", JSON.stringify(listing, null, 2));

        return {
            success: true,
            message: "Listing saved. Continue to checkout to publish your advert.",
            listingId: listing.id,
            data: listing
        };
    } catch (dbError) {
        console.log("🔴 [SERVICE] Database error:", dbError.message);
        throw new Error("Database error: " + dbError.message);
    }
};

const latest = async () => {
    try {
        const listings = await ListingModel.findLatest();
        
        // ✅ Fetch images for each listing
        for (let i = 0; i < listings.length; i++) {
            const imagesResult = await pool.query(
                `SELECT id, url, display_order FROM listing_images 
                 WHERE listing_id = $1 
                 ORDER BY display_order ASC`,
                [listings[i].id]
            );
            listings[i].images = imagesResult.rows;
        }
        
        return {
            success: true,
            data: listings
        };
    } catch (error) {
        console.log("🔴 [SERVICE] Latest error:", error.message);
        throw new Error("Failed to fetch latest listings.");
    }
};

const getById = async (id) => {
    try {
        const listing = await ListingModel.findById(id);

        if (!listing) {
            throw new Error("Listing not found.");
        }
        
        // ✅ Fetch images for this listing
        const imagesResult = await pool.query(
            `SELECT id, url, display_order FROM listing_images 
             WHERE listing_id = $1 
             ORDER BY display_order ASC`,
            [id]
        );
        listing.images = imagesResult.rows;

        return {
            success: true,
            data: listing
        };
    } catch (error) {
        console.log("🔴 [SERVICE] Get by ID error:", error.message);
        throw error;
    }
};

const publishListing = async (listingId) => {
    try {
        // Verify listing exists and is in pending_payment state
        const listing = await ListingModel.findById(listingId);

        if (!listing) {
            return { success: false, error: "Listing not found" };
        }

        if (listing.status === "published") {
            return { success: true, message: "Listing already published" };
        }

        if (listing.status !== "pending_payment") {
            return {
                success: false,
                error: `Cannot publish listing with status: ${listing.status}`
            };
        }

        const published = await ListingModel.publishListing(listingId);

        if (!published) {
            return { success: false, error: "Failed to publish listing" };
        }

        return {
            success: true,
            message: "Listing published successfully",
            data: published
        };
    } catch (error) {
        console.log("🔴 [SERVICE] Publish error:", error.message);
        return { success: false, error: error.message };
    }
};

const getSellerListings = async (userId, filters = {}) => {
    const {
        limit = 20,
        offset = 0,
        status,
        sort_by = "newest",
    } = filters;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Filter by user
    conditions.push(`l.user_id = $${paramIndex}`);
    params.push(userId);
    paramIndex++;

    // Filter by status
    if (status && status !== "all") {
        conditions.push(`l.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sort order
    let orderClause = "";
    switch (sort_by) {
        case "price_asc":
            orderClause = "ORDER BY l.price ASC";
            break;
        case "price_desc":
            orderClause = "ORDER BY l.price DESC";
            break;
        case "newest":
        default:
            orderClause = "ORDER BY l.created_at DESC";
            break;
    }

    // Count total
    const countQuery = `
        SELECT COUNT(*) as total
        FROM listings l
        ${whereClause}
    `;

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Main query with images - UPDATED with COALESCE
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
            l.payment_status,
            l.views,
            l.contact_unlocks,
            l.created_at,
            l.published_at,
            COALESCE(c.name, 'Unknown') as category_name,
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

const updateListing = async (listingId, userId, updateData) => {
    const {
        title,
        description,
        price,
        province,
        city,
        category_id,
    } = updateData;

    // Verify listing belongs to user
    const existing = await pool.query(
        `SELECT * FROM listings WHERE id = $1 AND user_id = $2`,
        [listingId, userId]
    );

    if (existing.rows.length === 0) {
        throw new Error("Listing not found or you don't have permission.");
    }

    const fields = [];
    const params = [];
    let paramIndex = 1;

    if (title) {
        fields.push(`title = $${paramIndex}`);
        params.push(title.trim());
        paramIndex++;
    }
    if (description) {
        fields.push(`description = $${paramIndex}`);
        params.push(description.trim());
        paramIndex++;
    }
    if (price) {
        fields.push(`price = $${paramIndex}`);
        params.push(Number(price));
        paramIndex++;
    }
    if (province) {
        fields.push(`province = $${paramIndex}`);
        params.push(province.trim());
        paramIndex++;
    }
    if (city) {
        fields.push(`city = $${paramIndex}`);
        params.push(city.trim());
        paramIndex++;
    }
    if (category_id) {
        fields.push(`category_id = $${paramIndex}`);
        params.push(Number(category_id));
        paramIndex++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(listingId);

    const query = `
        UPDATE listings
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
        RETURNING *
    `;

    params.push(userId);

    const result = await pool.query(query, params);

    return result.rows[0] || null;
};

const deleteListing = async (listingId, userId) => {
    // Verify listing belongs to user
    const existing = await pool.query(
        `SELECT * FROM listings WHERE id = $1 AND user_id = $2`,
        [listingId, userId]
    );

    if (existing.rows.length === 0) {
        throw new Error("Listing not found or you don't have permission.");
    }

    // Delete listing (images will be cascade deleted)
    const result = await pool.query(
        `DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING id`,
        [listingId, userId]
    );

    return result.rows[0] || null;
};

const getListingStats = async (userId) => {
    const result = await pool.query(
        `
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
            COUNT(CASE WHEN status = 'pending_payment' THEN 1 END) as pending,
            COALESCE(SUM(views), 0) as total_views,
            COALESCE(SUM(contact_unlocks), 0) as total_contact_unlocks
        FROM listings
        WHERE user_id = $1
        `,
        [userId]
    );

    return result.rows[0];
};

module.exports = {
    create,
    latest,
    getById,
    publishListing,
    getSellerListings,
    updateListing,
    deleteListing,
    getListingStats,
};