const pool = require("../config/db");

/**
 * Calculate Listing Quality Score (0-100)
 */
const calculateListingQuality = (listing) => {
    let score = 0;
    const feedback = [];

    // 1. Title Quality (max 20 points)
    if (listing.title && listing.title.length >= 20) {
        score += 20;
        feedback.push("✅ Great title length");
    } else if (listing.title && listing.title.length >= 10) {
        score += 10;
        feedback.push("📝 Title could be more descriptive");
    } else {
        feedback.push("📝 Title is too short. Be more descriptive.");
    }

    // 2. Description Quality (max 25 points)
    if (listing.description && listing.description.length >= 100) {
        score += 25;
        feedback.push("✅ Detailed description");
    } else if (listing.description && listing.description.length >= 50) {
        score += 15;
        feedback.push("📝 Add more details to your description");
    } else {
        feedback.push("📝 Description is too short. Add more details.");
    }

    // 3. Price (max 15 points)
    if (listing.price && listing.price > 0) {
        score += 15;
        feedback.push("✅ Price set");
    } else {
        feedback.push("💰 Please set a price");
    }

    // 4. Images (max 25 points)
    // Check if there are images (we'll check the count)
    if (listing.image_count && listing.image_count >= 3) {
        score += 25;
        feedback.push("✅ Great photos!");
    } else if (listing.image_count && listing.image_count >= 1) {
        score += 15;
        feedback.push("📸 Add more photos (3+ recommended)");
    } else {
        feedback.push("📸 Add photos to attract buyers");
    }

    // 5. Location (max 15 points)
    if (listing.province && listing.city) {
        score += 15;
        feedback.push("✅ Location provided");
    } else if (listing.province) {
        score += 10;
        feedback.push("📍 Add your city for better visibility");
    } else {
        feedback.push("📍 Add your location");
    }

    return {
        score: Math.min(score, 100),
        feedback,
        level: score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement",
    };
};

/**
 * Get listing quality for a specific listing
 */
const getListingQuality = async (listingId, userId) => {
    // Get listing with image count
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
            COUNT(li.id) as image_count
        FROM listings l
        LEFT JOIN listing_images li ON l.id = li.listing_id
        WHERE l.id = $1 AND l.user_id = $2
        GROUP BY l.id
        `,
        [listingId, userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const listing = result.rows[0];
    return calculateListingQuality(listing);
};

/**
 * Calculate Seller Health Score
 */
const calculateSellerHealth = async (userId) => {
    const result = await pool.query(
        `
        SELECT 
            COUNT(*) as total_listings,
            COUNT(CASE WHEN status = 'published' THEN 1 END) as published_listings,
            COALESCE(SUM(views), 0) as total_views,
            COALESCE(SUM(contact_unlocks), 0) as total_contact_unlocks
        FROM listings
        WHERE user_id = $1
        `,
        [userId]
    );

    const stats = result.rows[0];
    const totalListings = parseInt(stats.total_listings);
    const publishedListings = parseInt(stats.published_listings);
    const totalViews = parseInt(stats.total_views);
    const totalContactUnlocks = parseInt(stats.total_contact_unlocks);

    // Calculate health score components
    let score = 0;
    const feedback = [];

    // 1. Listing Volume (max 25 points)
    if (totalListings >= 10) {
        score += 25;
        feedback.push("✅ Active seller with many listings");
    } else if (totalListings >= 5) {
        score += 15;
        feedback.push("📊 Good number of listings");
    } else if (totalListings >= 1) {
        score += 10;
        feedback.push("📊 Start with more listings to build trust");
    }

    // 2. Publication Rate (max 25 points)
    const publishRate = totalListings > 0 ? (publishedListings / totalListings) * 100 : 0;
    if (publishRate >= 80) {
        score += 25;
        feedback.push("✅ High publication rate");
    } else if (publishRate >= 50) {
        score += 15;
        feedback.push("📝 Try to publish more of your listings");
    } else {
        feedback.push("📝 Focus on publishing your listings");
    }

    // 3. Views (max 25 points)
    if (totalViews >= 100) {
        score += 25;
        feedback.push("✅ High visibility");
    } else if (totalViews >= 50) {
        score += 15;
        feedback.push("👀 Good visibility");
    } else {
        feedback.push("👀 Optimize your listings to get more views");
    }

    // 4. Contact Unlocks (max 25 points)
    if (totalContactUnlocks >= 10) {
        score += 25;
        feedback.push("✅ Strong buyer interest");
    } else if (totalContactUnlocks >= 5) {
        score += 15;
        feedback.push("📞 Good buyer interest");
    } else {
        feedback.push("📞 Build more buyer interest");
    }

    return {
        score: Math.min(score, 100),
        feedback,
        level: score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement",
        stats: {
            total_listings: totalListings,
            published_listings: publishedListings,
            publish_rate: Math.round(publishRate),
            total_views: totalViews,
            total_contact_unlocks: totalContactUnlocks,
        },
    };
};

module.exports = {
    calculateListingQuality,
    getListingQuality,
    calculateSellerHealth,
};