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
    // ✅ Add reset token columns to users table
    console.log('📝 Adding reset_token columns to users table...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP
    `);
    console.log('✅ Reset token columns added successfully!');

    // ✅ Verify the columns were added
    const result = await pool.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'users' 
       AND column_name IN ('reset_token', 'reset_token_expires')`
    );
    const columns = result.rows.map(r => r.column_name).join(', ');
    console.log(`📋 Columns added: ${columns}`);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();