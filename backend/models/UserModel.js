const pool = require("../config/db");

const findByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            last_name,
            email,
            password_hash,
            mobile,
            province,
            city,
            is_verified,
            reputation_score,
            created_at
        FROM users
        WHERE email = $1
        `,
        [email.toLowerCase()]
    );

    return result.rows[0] || null;
};

const create = async ({
    first_name,
    last_name,
    email,
    password_hash,
    mobile,
    province,
    city
}) => {
    const result = await pool.query(
        `
        INSERT INTO users
        (
            first_name,
            last_name,
            email,
            password_hash,
            mobile,
            province,
            city
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING
            id,
            first_name,
            last_name,
            email,
            mobile,
            province,
            city,
            is_verified,
            reputation_score,
            created_at
        `,
        [
            first_name,
            last_name,
            email.toLowerCase(),
            password_hash,
            mobile,
            province,
            city
        ]
    );

    return result.rows[0];
};

module.exports = {
    findByEmail,
    create
};
// Add to existing UserModel.js

const updateResetToken = async (userId, resetToken, resetTokenExpires) => {
    const result = await pool.query(
        `
        UPDATE users 
        SET reset_token = $1, reset_token_expires = $2
        WHERE id = $3
        RETURNING id, email
        `,
        [resetToken, resetTokenExpires, userId]
    );
    return result.rows[0] || null;
};

const findByResetToken = async (resetToken) => {
    const result = await pool.query(
        `
        SELECT * FROM users
        WHERE reset_token = $1
        AND reset_token_expires > NOW()
        `,
        [resetToken]
    );
    return result.rows[0] || null;
};

const updatePassword = async (userId, passwordHash) => {
    const result = await pool.query(
        `
        UPDATE users 
        SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
        WHERE id = $2
        RETURNING id, email
        `,
        [passwordHash, userId]
    );
    return result.rows[0] || null;
};