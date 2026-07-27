const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// PayFast webhook - public endpoint (POST)
router.post("/webhook", paymentController.handleWebhook);

// Verify payment status - public endpoint (GET)
router.get("/verify/:listingId", paymentController.verifyPayment);

// ✅ Add a test route to verify the router is working
router.get("/test", (req, res) => {
    res.json({ message: "Payment routes are working!" });
});

module.exports = router;