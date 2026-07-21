const pool = require("../config/db");

const getMarketplaceStats = async () => {
    // Get total active listings (published)
    const activeResult = await pool.query(
        `SELECT COUNT(*) as count FROM listings WHERE status = 'published'`
    );
    
    // Get new today (published in last 24 hours)
    const newTodayResult = await pool.query(
        `SELECT COUNT(*) as count FROM listings 
         WHERE status = 'published' 
         AND published_at >= NOW() - INTERVAL '24 hours'`
    );
    
    // Get verified sellers (users with is_verified = true)
    const verifiedResult = await pool.query(
        `SELECT COUNT(*) as count FROM users WHERE is_verified = true`
    );
    
    // Get Seven Shield verified (users with verification complete)
    const sevenShieldResult = await pool.query(
        `SELECT COUNT(*) as count FROM users WHERE is_verified = true`
    );

    return {
        active_listings: parseInt(activeResult.rows[0].count),
        new_today: parseInt(newTodayResult.rows[0].count),
        verified_sellers: parseInt(verifiedResult.rows[0].count),
        seven_shield_verified: parseInt(sevenShieldResult.rows[0].count),
    };
};

module.exports = {
    getMarketplaceStats,
};