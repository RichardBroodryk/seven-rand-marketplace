const crypto = require("crypto");

/**
 * Verify PayFast webhook signature
 */
exports.verifyWebhookSignature = async (payload) => {
  try {
    // For sandbox, use the sandbox merchant key
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";

    console.log("🔵 [SIGNATURE] Payload received:", JSON.stringify(payload, null, 2));

    // Check if we have the required fields
    if (!payload.m_payment_id || !payload.payment_status) {
      console.log("🔴 [SIGNATURE] Missing required fields");
      return false;
    }

    // For sandbox testing, accept without strict signature verification
    // This is because sandbox sometimes sends incomplete data
    if (process.env.PAYFAST_SANDBOX === "true") {
      console.log("🔵 [SIGNATURE] Sandbox mode - accepting webhook without signature verification");
      return true;
    }

    // Build signature string using only fields that exist
    const signatureParts = [
      `merchant_id=${payload.merchant_id || ""}`,
      `merchant_key=${merchantKey}`,
    ];

    // Only add fields that have values
    if (payload.payment_id) {
      signatureParts.push(`payment_id=${payload.payment_id}`);
    }
    if (payload.m_payment_id) {
      signatureParts.push(`m_payment_id=${payload.m_payment_id}`);
    }
    if (payload.amount) {
      signatureParts.push(`amount=${payload.amount}`);
    }
    if (payload.payment_status) {
      signatureParts.push(`payment_status=${payload.payment_status}`);
    }

    const signatureString = signatureParts.join("&");
    console.log("🔵 [SIGNATURE] Signature string:", signatureString);

    // Generate signature
    const generatedSignature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    console.log("🔵 [SIGNATURE] Generated:", generatedSignature);
    console.log("🔵 [SIGNATURE] Received:", payload.signature);

    // Compare signatures (case insensitive)
    const isValid = generatedSignature.toLowerCase() === (payload.signature || "").toLowerCase();
    console.log(`🔵 [SIGNATURE] Valid: ${isValid}`);
    
    return isValid;
  } catch (error) {
    console.error("🔴 [SIGNATURE] Error:", error.message);
    return false;
  }
};

/**
 * Generate payment signature for frontend (if needed)
 */
exports.generateSignature = (data) => {
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
  
  const signatureParts = [
    `merchant_id=${data.merchant_id || ""}`,
    `merchant_key=${merchantKey}`,
  ];

  // Add optional fields only if they exist
  if (data.return_url) signatureParts.push(`return_url=${data.return_url}`);
  if (data.cancel_url) signatureParts.push(`cancel_url=${data.cancel_url}`);
  if (data.notify_url) signatureParts.push(`notify_url=${data.notify_url}`);
  if (data.name_first) signatureParts.push(`name_first=${data.name_first}`);
  if (data.name_last) signatureParts.push(`name_last=${data.name_last}`);
  if (data.email_address) signatureParts.push(`email_address=${data.email_address}`);
  if (data.m_payment_id) signatureParts.push(`m_payment_id=${data.m_payment_id}`);
  if (data.amount) signatureParts.push(`amount=${data.amount}`);
  if (data.item_name) signatureParts.push(`item_name=${data.item_name}`);
  if (data.item_description) signatureParts.push(`item_description=${data.item_description}`);

  const signatureString = signatureParts.join("&");

  return crypto.createHash("md5").update(signatureString).digest("hex");
};