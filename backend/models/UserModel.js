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