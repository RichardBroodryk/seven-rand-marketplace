const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ⚠️ IMPORTANT: Replace this with YOUR Render External Connection String
const DATABASE_URL = 'postgresql://seven_rand_user:xivsqnkioILoDGJj0q6EzOB6iaRDc327@dpg-d9fkif3tqb8s73da27jg-a.oregon-postgres.render.com/seven_rand_marketplace';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🔄 Connecting to Render database...');

  try {
    // ============================================================
    // 1. ✅ Add reset token columns to users table
    // ============================================================
    console.log('📝 Adding reset_token columns to users table...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP
    `);
    console.log('✅ Reset token columns added successfully!');

    // ============================================================
    // 2. ✅ Create listing_images table
    // ============================================================
    console.log('📝 Creating listing_images table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listing_images (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
          url TEXT NOT NULL,
          public_id VARCHAR(255) NOT NULL,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ listing_images table created!');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id)
    `);
    console.log('✅ listing_images index created!');

    // ============================================================
    // 3. ✅ Create favourites table
    // ============================================================
    console.log('📝 Creating favourites table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favourites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, listing_id)
      )
    `);
    console.log('✅ favourites table created!');

    // ============================================================
    // 4. ✅ Create saved_searches table
    // ============================================================
    console.log('📝 Creating saved_searches table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_searches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          keyword VARCHAR(255),
          category_id INTEGER,
          province VARCHAR(100),
          city VARCHAR(100),
          min_price NUMERIC(12,2),
          max_price NUMERIC(12,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_notified_at TIMESTAMP
      )
    `);
    console.log('✅ saved_searches table created!');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id)
    `);
    console.log('✅ saved_searches index created!');

    // ============================================================
    // 5. ✅ Insert all categories (including new ones)
    // ============================================================
    console.log('📝 Inserting all categories...');
    await pool.query(`
      INSERT INTO categories (id, name, slug, seller_fee, buyer_contact_fee, is_premium) VALUES
      (1, 'Vehicles', 'vehicles', 14.00, 0.00, true),
      (2, 'Property', 'property', 14.00, 0.00, true),
      (3, 'Commercial Equipment', 'commercial-equipment', 14.00, 0.00, true),
      (4, 'Electronics', 'electronics', 7.00, 7.00, false),
      (5, 'Furniture', 'furniture', 7.00, 7.00, false),
      (6, 'Home & Garden', 'home-garden', 7.00, 7.00, false),
      (7, 'Fashion', 'fashion', 7.00, 7.00, false),
      (8, 'Sports', 'sports', 7.00, 7.00, false),
      (9, 'Other', 'other', 7.00, 7.00, false),
      (10, 'Jobs', 'jobs', 7.00, 7.00, false),
      (11, 'Services', 'services', 7.00, 7.00, false),
      (12, 'Pets', 'pets', 7.00, 7.00, false),
      (13, 'Gaming', 'gaming', 7.00, 7.00, false),
      (14, 'Baby & Kids', 'baby-kids', 7.00, 7.00, false),
      (15, 'Farming', 'farming', 14.00, 0.00, true),
      (16, 'Business & Industrial', 'business-industrial', 14.00, 0.00, true),
      (17, 'Boating & Marine', 'boating-marine', 14.00, 0.00, true),
      (18, 'Trucks & Heavy Vehicles', 'trucks-heavy', 14.00, 0.00, true),
      (19, 'Caravans & Camping', 'caravans-camping', 14.00, 0.00, true),
      (20, 'Tools & Equipment', 'tools-equipment', 7.00, 7.00, false),
      (21, 'Trailers', 'trailers', 14.00, 0.00, true),
      (22, 'Cosmetics & Beauty', 'cosmetics-beauty', 7.00, 7.00, false)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        seller_fee = EXCLUDED.seller_fee,
        buyer_contact_fee = EXCLUDED.buyer_contact_fee,
        is_premium = EXCLUDED.is_premium
    `);
    console.log('✅ Categories inserted successfully!');

    // ============================================================
    // 6. ✅ Verify everything
    // ============================================================
    const result = await pool.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'users' 
       AND column_name IN ('reset_token', 'reset_token_expires')`
    );
    const columns = result.rows.map(r => r.column_name).join(', ');
    console.log(`📋 Users table columns added: ${columns}`);

    const catResult = await pool.query(
      `SELECT COUNT(*) FROM categories`
    );
    console.log(`📋 Total categories in database: ${catResult.rows[0].count}`);

    const tableResult = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const tables = tableResult.rows.map(r => r.table_name).join(', ');
    console.log(`📋 Tables in database: ${tables}`);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();