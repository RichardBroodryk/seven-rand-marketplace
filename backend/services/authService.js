const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const UserModel = require("../models/UserModel");

const SALT_ROUNDS = 10;

const register = async (user) => {
    const {
        first_name,
        last_name,
        email,
        password,
        mobile,
        province,
        city
    } = user;

    if (!first_name || !last_name || !email || !password) {
        throw new Error("Please complete all required fields.");
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
        throw new Error("Email address already registered.");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await UserModel.create({
        first_name,
        last_name,
        email,
        password_hash,
        mobile: mobile || null,
        province: province || null,
        city: city || null
    });

    return {
        success: true,
        message: "Registration successful.",
        data: {
            token: generateToken(createdUser),
            user: createdUser
        }
    };
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password.");
    }

    return {
        success: true,
        message: "Login successful.",
        data: {
            token: generateToken(user),
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                province: user.province,
                city: user.city,
                is_verified: user.is_verified,
                reputation_score: user.reputation_score
            }
        }
    };
};

const me = async (user) => {
    const existingUser = await UserModel.findByEmail(user.email);

    if (!existingUser) {
        throw new Error("User not found.");
    }

    return {
        success: true,
        data: {
            id: existingUser.id,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            email: existingUser.email,
            mobile: existingUser.mobile,
            province: existingUser.province,
            city: existingUser.city,
            is_verified: existingUser.is_verified,
            reputation_score: existingUser.reputation_score
        }
    };
};

module.exports = {
    register,
    login,
    me
};