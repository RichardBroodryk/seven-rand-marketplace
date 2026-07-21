const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// PayFast webhook - public endpoint (PayFast calls this)
router.post("/webhook", paymentController.handleWebhook);

// Verify payment status - protected endpoint
router.get("/verify/:listingId", paymentController.verifyPayment);

module.exports = router;