const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://seven_rand_user:xivsqnkioILoDGJj0q6EzOB6iaRDc327@dpg-d9fkif3tqb8s73da27jg-a.oregon-postgres.render.com/seven_rand_marketplace',
  ssl: { rejectUnauthorized: false }
});

async function checkImages() {
  try {
    // Check total images
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM listing_images;`);
    console.log('📸 Total images in database:', countResult.rows[0].total);

    if (countResult.rows[0].total > 0) {
      // Show the images
      const result = await pool.query(`
        SELECT 
          li.id,
          li.listing_id,
          li.url,
          li.display_order,
          l.title as listing_title
        FROM listing_images li
        JOIN listings l ON li.listing_id = l.id
        ORDER BY li.created_at DESC
        LIMIT 10;
      `);
      console.log('\n📸 Recent images:');
      console.table(result.rows);
    } else {
      console.log('❌ No images found in the database.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkImages();