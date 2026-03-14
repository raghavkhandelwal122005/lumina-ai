const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: 'c:/Users/LENOVO/Desktop/health-care-ai-main/backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runSchema() {
  try {
    const schema = fs.readFileSync('c:/Users/LENOVO/Desktop/health-care-ai-main/frontend/original_repo/health-care-ai-main/database_schema.sql', 'utf8');
    // Splitting by semicolon might be naive if there are semicolons in functions, 
    // but the schema looks simple enough. However, pg pool.query can't handle multiple statements easily usually.
    // Let's try executing the whole thing.
    await pool.query(schema);
    console.log('Schema executed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error executing schema:', err.message);
    process.exit(1);
  }
}

runSchema();
