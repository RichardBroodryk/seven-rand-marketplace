const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read the schema file
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// ⚠️ IMPORTANT: Replace this with YOUR Render External Connection String
const DATABASE_URL = 'postgresql://seven_rand_user:xivsqnkioILoDGJj0q6EzOB6iaRDc327@dpg-d9fkif3tqb8s73da27jg-a.oregon-postgres.render.com/seven_rand_marketplace';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🔄 Connecting to Render database...');
  
  try {
    // Run the schema
    await pool.query(schema);
    console.log('✅ Schema created successfully!');

    // Verify tables
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const tables = result.rows.map(r => r.table_name).join(', ');
    console.log(`📋 Tables created: ${tables}`);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();