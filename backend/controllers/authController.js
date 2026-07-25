const bcrypt = require("bcrypt");
const crypto = require("crypto"); // ✅ Only ONCE at the top
const authService = require("../services/authService");
const UserModel = require("../models/UserModel");
const emailService = require("../services/emailService");

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const me = async (req, res) => {
    try {
        const result = await authService.me(req.user);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// PASSWORD RESET FUNCTIONS
// ============================================================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email address.",
            });
        }

        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If this email exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 3600000);

        await UserModel.updateResetToken(user.id, resetToken, resetTokenExpires);

        await emailService.sendPasswordResetEmail(user, resetToken);

        return res.status(200).json({
            success: true,
            message: "If this email exists, a reset link has been sent.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send reset email.",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide a token and new password.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        const user = await UserModel.findByResetToken(token);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token.",
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(user.id, passwordHash);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please log in.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password.",
        });
    }
};

module.exports = {
    register,
    login,
    me,
    forgotPassword,
    resetPassword,
};