const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    // Log to console for debugging
    console.log("📧 ===== EMAIL SENT ===== 📧");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("===========================");

    // Send actual email
    await transporter.sendMail({
        from: process.env.SMTP_FROM || "support@rugbyanthemzone.com",
        to,
        subject,
        html,
    });
};

// ============================================================
// 1. Welcome Email (User Registration)
// ============================================================
const sendWelcomeEmail = async (user) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
                .shield { color: #10b981; font-size: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🛡️ Seven Rand Marketplace</div>
                    <p style="color: #6b7280; margin: 4px 0 0;">Smaller Fee. Bigger Deals.</p>
                </div>
                <div class="content">
                    <h2>Welcome to the family, ${user.first_name}! 🎉</h2>
                    <p>You've just joined South Africa's most trusted marketplace. Every deal here starts with trust.</p>
                    <p><strong>Here's what you can do:</strong></p>
                    <ul>
                        <li>✅ Post your first ad for just R7</li>
                        <li>✅ Browse thousands of trusted listings</li>
                        <li>✅ Connect with verified sellers through Safe Verified Contact</li>
                        <li>✅ Build your Seven Shield reputation</li>
                    </ul>
                    <p style="text-align: center; margin: 24px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/post-ad" class="button">Post Your First Ad →</a>
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        <span class="shield">🛡️</span> You're protected by Seven Shield. Trust is our promise.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #10b981; text-decoration: none;">sevenrand.com</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(user.email, "Welcome to Seven Rand Marketplace! 🎉", html);
};

// ============================================================
// 2. Listing Published Email
// ============================================================
const sendListingPublishedEmail = async (user, listing) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .listing-box { background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; }
                .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🛡️ Seven Rand Marketplace</div>
                </div>
                <div class="content">
                    <h2>Your listing is live! 🚀</h2>
                    <p>Great news, ${user.first_name}! Your listing has been published and is now visible to buyers.</p>
                    <div class="listing-box">
                        <h3 style="margin: 0;">${listing.title}</h3>
                        <p style="margin: 4px 0; color: #6b7280;">R${listing.price} • ${listing.city}, ${listing.province}</p>
                    </div>
                    <p>Your listing is now protected by Seven Shield. Buyers can see your verified status and trust your listing.</p>
                    <p style="text-align: center; margin: 24px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/listing/${listing.id}" class="button">View Your Listing →</a>
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        💡 Tip: Share your listing on social media to reach more buyers!
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(user.email, "Your listing is live! 🚀", html);
};

// ============================================================
// 3. Safe Verified Contact Purchased Email
// ============================================================
const sendVerifiedContactEmail = async (user, seller, listing) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .contact-box { background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #86efac; }
                .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
                .shield { color: #10b981; font-size: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🛡️ Seven Rand Marketplace</div>
                    <p style="color: #10b981; margin: 4px 0 0;">Safe Verified Contact</p>
                </div>
                <div class="content">
                    <h2>🔓 Contact Details Unlocked!</h2>
                    <p>Hi ${user.first_name}, you've successfully unlocked verified contact details for this listing:</p>
                    <div style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; margin: 8px 0;">
                        <h3 style="margin: 0;">${listing.title}</h3>
                        <p style="margin: 4px 0; color: #6b7280;">R${listing.price} • ${listing.city}, ${listing.province}</p>
                    </div>
                    <div class="contact-box">
                        <h4 style="margin: 0 0 8px;">📞 Verified Contact Details</h4>
                        <p style="margin: 4px 0;"><strong>Seller:</strong> ${seller.first_name} ${seller.last_name}</p>
                        <p style="margin: 4px 0;"><strong>Email:</strong> ${seller.email}</p>
                        <p style="margin: 4px 0;"><strong>Phone:</strong> ${seller.mobile || "Contact via email first"}</p>
                        <p style="margin: 8px 0 0; color: #10b981; font-size: 14px;">
                            <span class="shield">🛡️</span> This seller is verified by Seven Shield
                        </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">
                        ✅ You're protected by Seven Shield Buyer Protection.
                    </p>
                    <p style="text-align: center; margin: 24px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/safety-centre" class="button">Safety Tips →</a>
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(user.email, "🔓 Contact Details Unlocked!", html);
};

// ============================================================
// 4. Contact Support / Safety Page
// ============================================================
const sendContactSupportEmail = async (data) => {
    const { name, email, subject, message, page } = data;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .info-box { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 12px 0; }
                .label { font-weight: 600; color: #4b5563; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🛡️ Seven Rand Marketplace</div>
                    <p style="color: #6b7280; margin: 4px 0 0;">Contact & Support</p>
                </div>
                <div class="content">
                    <h2>New Contact Form Submission</h2>
                    <div class="info-box">
                        <p><span class="label">Name:</span> ${name}</p>
                        <p><span class="label">Email:</span> ${email}</p>
                        <p><span class="label">Subject:</span> ${subject}</p>
                        <p><span class="label">Page:</span> ${page || "Support"}</p>
                    </div>
                    <h3>Message:</h3>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
                        ${message}
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        This message was sent from the ${page || "Support"} page.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                    <p>🛡️ Protected by Seven Shield</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(process.env.SUPPORT_EMAIL || "support@rugbyanthemzone.com", `🔒 New Contact: ${subject}`, html);

    // Confirmation to user
    const userHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🛡️ Seven Rand Marketplace</div>
                </div>
                <div class="content">
                    <h2>We've Received Your Message ✅</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for contacting us. We've received your message and will get back to you within 24-48 hours.</p>
                    <p><strong>Your message:</strong></p>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
                        "${message}"
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        In the meantime, check out our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/safety-centre" style="color: #10b981;">Safety Centre</a> for tips on staying safe.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(email, "We've received your message ✅", userHtml);
};

// ============================================================
// 5. Resolution Centre Email
// ============================================================
const sendResolutionEmail = async (data) => {
    const { name, email, listingId, issueType, description, orderNumber } = data;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .info-box { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 12px 0; }
                .label { font-weight: 600; color: #4b5563; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
                .urgent { background: #fef2f2; color: #dc2626; }
                .standard { background: #fef3c7; color: #92400e; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⚖️ Seven Rand Marketplace</div>
                    <p style="color: #6b7280; margin: 4px 0 0;">Resolution Centre</p>
                </div>
                <div class="content">
                    <h2>New Resolution Request</h2>
                    <div class="info-box">
                        <p><span class="label">Name:</span> ${name}</p>
                        <p><span class="label">Email:</span> ${email}</p>
                        <p><span class="label">Listing ID:</span> ${listingId || "Not provided"}</p>
                        <p><span class="label">Order #:</span> ${orderNumber || "Not provided"}</p>
                        <p><span class="label">Issue Type:</span> <span class="badge ${issueType === 'Urgent' ? 'urgent' : 'standard'}">${issueType || "General"}</span></p>
                    </div>
                    <h3>Description:</h3>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        ${description}
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        ⏱️ We aim to respond to all resolution requests within 24 hours.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                    <p>🛡️ Protected by Seven Shield</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(process.env.RESOLUTION_EMAIL || "support@rugbyanthemzone.com", `⚖️ New Resolution Request`, html);

    // Confirmation to user
    const userHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⚖️ Seven Rand Marketplace</div>
                </div>
                <div class="content">
                    <h2>Your Resolution Request Has Been Received ✅</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for submitting your resolution request. Our team will review your case and respond within 24 hours.</p>
                    <p><strong>Your request:</strong></p>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        "${description}"
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        In the meantime, visit our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/resolution-centre" style="color: #10b981;">Resolution Centre</a> for updates.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(email, "Your resolution request has been received ✅", userHtml);
};

// ============================================================
// 6. Privacy & Data Email
// ============================================================
const sendPrivacyEmail = async (data) => {
    const { name, email, requestType, message } = data;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .info-box { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 12px 0; }
                .label { font-weight: 600; color: #4b5563; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🔒 Seven Rand Marketplace</div>
                    <p style="color: #6b7280; margin: 4px 0 0;">Privacy & Data Protection</p>
                </div>
                <div class="content">
                    <h2>New Privacy Request</h2>
                    <div class="info-box">
                        <p><span class="label">Name:</span> ${name}</p>
                        <p><span class="label">Email:</span> ${email}</p>
                        <p><span class="label">Request Type:</span> ${requestType}</p>
                    </div>
                    <h3>Message:</h3>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
                        ${message}
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        🔒 We take your privacy seriously. This request will be handled in accordance with POPIA.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                    <p>🔒 Protected by POPIA Compliance</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(process.env.PRIVACY_EMAIL || "support@rugbyanthemzone.com", `🔒 Privacy Request: ${requestType}`, html);

    // Confirmation to user
    const userHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #1f2937; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
                .logo { font-size: 24px; font-weight: 700; color: #10b981; }
                .content { padding: 30px 0; }
                .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🔒 Seven Rand Marketplace</div>
                </div>
                <div class="content">
                    <h2>Your Privacy Request Has Been Received ✅</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for your privacy request. Our privacy team will review your request and respond within 48 hours.</p>
                    <p><strong>Your request:</strong></p>
                    <p style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
                        "${message}"
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        Learn more about how we protect your data on our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacy" style="color: #10b981;">Privacy & Data</a> page.
                    </p>
                </div>
                <div class="footer">
                    <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(email, "Your privacy request has been received ✅", userHtml);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #1f2937; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; }
        .logo { font-size: 24px; font-weight: 700; color: #10b981; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; }
        .footer { text-align: center; padding-top: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ Seven Rand Marketplace</div>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hi ${user.first_name},</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" class="button">Reset Password →</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p>Seven Rand Marketplace • Every Deal Starts With Trust</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(user.email, "Reset Your Password", html);
};
module.exports = {
    sendWelcomeEmail,
    sendListingPublishedEmail,
    sendVerifiedContactEmail,
    sendContactSupportEmail,
    sendResolutionEmail,
    sendPrivacyEmail,
    sendPasswordResetEmail, 
};