const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
  const res = await pool.query("SELECT id, email FROM users");
  console.log("Users in DB:", res.rows);
  await pool.end();
}

checkUsers();
