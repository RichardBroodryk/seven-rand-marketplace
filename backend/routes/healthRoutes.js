const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT NOW()");

        return res.json({
            status: "ok",
            application: "Seven Rand Marketplace",
            version: "1.0.0",
            database: "Connected"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            application: "Seven Rand Marketplace",
            database: "Disconnected",
            error: error.message
        });
    }
});

module.exports = router;