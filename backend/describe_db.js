const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function describeTables() {
  try {
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in DB:", tables.rows.map(r => r.table_name));

    for (const table of tables.rows) {
      const cols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table.table_name}'
      `);
      console.log(`\nColumns for ${table.table_name}:`);
      console.log(JSON.stringify(cols.rows, null, 2));
    }
  } catch (err) {
    console.error("Error describing tables:", err.message);
  } finally {
    await pool.end();
  }
}

describeTables();
