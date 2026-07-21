const authService = require("../services/authService");

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

module.exports = {
    register,
    login,
    me
};