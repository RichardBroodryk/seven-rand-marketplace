-- =====================================================
-- Seven Rand Marketplace
-- Database Schema v1
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    mobile VARCHAR(20),

    province VARCHAR(100),

    city VARCHAR(100),

    is_verified BOOLEAN DEFAULT FALSE,

    reputation_score INTEGER DEFAULT 100,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    slug VARCHAR(100) UNIQUE NOT NULL,

    seller_fee NUMERIC(10,2) NOT NULL,

    buyer_contact_fee NUMERIC(10,2) NOT NULL,

    is_premium BOOLEAN DEFAULT FALSE

);

-- =====================================================
-- LISTINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS listings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    category_id INTEGER NOT NULL
        REFERENCES categories(id),

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    price NUMERIC(12,2) NOT NULL,

    province VARCHAR(100),

    city VARCHAR(100),

    status VARCHAR(30)
        NOT NULL
        DEFAULT 'pending_payment',

    payment_status VARCHAR(30)
        NOT NULL
        DEFAULT 'pending',

    payment_reference VARCHAR(255),

    published_at TIMESTAMP,

    views INTEGER DEFAULT 0,

    contact_unlocks INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);