const emailService = require("../services/emailService");

/**
 * Contact Support / Safety Page
 */
const contactSupport = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }

        await emailService.sendContactSupportEmail({
            name,
            email,
            subject: subject || "General Support",
            message,
            page: "Support & Safety",
        });

        return res.status(200).json({
            success: true,
            message: "Your message has been sent! We'll get back to you soon.",
        });
    } catch (error) {
        console.error("Contact support error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again.",
        });
    }
};

/**
 * Resolution Centre
 */
const resolutionCentre = async (req, res) => {
    try {
        const { name, email, listingId, issueType, description, orderNumber } = req.body;

        if (!name || !email || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }

        await emailService.sendResolutionEmail({
            name,
            email,
            listingId,
            issueType: issueType || "General",
            description,
            orderNumber,
        });

        return res.status(200).json({
            success: true,
            message: "Your resolution request has been submitted!",
        });
    } catch (error) {
        console.error("Resolution centre error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit resolution request.",
        });
    }
};

/**
 * Privacy & Data Page
 */
const privacyRequest = async (req, res) => {
    try {
        const { name, email, requestType, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }

        await emailService.sendPrivacyEmail({
            name,
            email,
            requestType: requestType || "General Inquiry",
            message,
        });

        return res.status(200).json({
            success: true,
            message: "Your privacy request has been submitted!",
        });
    } catch (error) {
        console.error("Privacy request error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit privacy request.",
        });
    }
};

module.exports = {
    contactSupport,
    resolutionCentre,
    privacyRequest,
};