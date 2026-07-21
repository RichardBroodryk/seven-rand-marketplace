const paymentService = require("../services/paymentService");
const listingService = require("../services/listingService");

/**
 * Handle PayFast webhook
 * This is called by PayFast after payment is processed
 */
exports.handleWebhook = async (req, res) => {
  // DEBUG: Log everything
  console.log("🔵 ========== WEBHOOK HIT ==========");
  console.log("🔵 Method:", req.method);
  console.log("🔵 URL:", req.url);
  console.log("🔵 Body:", JSON.stringify(req.body, null, 2));

  try {
    const payload = req.body;

    console.log("PayFast Webhook Received:", {
      payment_id: payload.payment_id,
      m_payment_id: payload.m_payment_id,
      amount: payload.amount,
      payment_status: payload.payment_status,
      signature: payload.signature,
    });

    // Verify the signature using paymentService
    const isValid = await paymentService.verifyWebhookSignature(payload);
    
    if (!isValid) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    console.log("✅ Signature verified successfully");

    // Extract listing ID from m_payment_id
    const listingId = payload.m_payment_id;

    if (!listingId) {
      console.error("❌ No listing ID in webhook");
      return res.status(400).json({ error: "Missing listing ID" });
    }

    // Check payment status
    if (payload.payment_status === "COMPLETE") {
      // Payment successful - publish the listing
      const result = await listingService.publishListing(listingId);

      if (result.success) {
        console.log(`✅ Listing ${listingId} published successfully`);
        return res.status(200).json({ success: true });
      } else {
        console.error(`❌ Failed to publish listing ${listingId}:`, result.error);
        return res.status(500).json({ error: "Failed to publish listing" });
      }
    } else {
      // Payment not complete - log and return
      console.log(`Payment for listing ${listingId} status: ${payload.payment_status}`);
      return res.status(200).json({ status: "Payment not complete" });
    }
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
};

/**
 * Verify payment status for a listing
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await listingService.getListingById(listingId);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: listing.id,
        status: listing.status,
        payment_status: listing.payment_status,
        is_published: listing.status === "published",
      },
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
};