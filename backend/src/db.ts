import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

// Mock database interactions if no local postgres is running
class MockPool {
  async connect() {
    return {
      query: async () => ({ rows: [] }),
      release: () => { }
    };
  }

  async query(text: string, params?: any[]) {
    console.log("Mock SQL Execution:", text);
    // Fake returning rows for RETURNING * clauses
    if (text.includes("INSERT INTO symptom_assessments")) {
      return { rows: [{ id: 'mock-uuid', risk_score: params![3] }] };
    }
    if (text.includes("INSERT INTO chat_messages")) {
      return { rows: [{ id: 'mock-uuid', content: params![1] }] };
    }
    if (text.includes("INSERT INTO HealthLogs")) {
      return { 
        rows: [{ 
          id: 'mock-uuid', 
          type: params![1],
          symptoms: params![2],
          notes: params![3],
          bp_sys: params![4],
          bp_dia: params![5],
          heart_rate: params![6],
          sugar_level: params![7],
          weight: params![8],
          created_at: new Date().toISOString()
        }] 
      };
    }
    return { rows: [] };
  }
}

export const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : new MockPool() as unknown as Pool;

export const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL provided. Running with Mock In-Memory Database for local testing.");
    return;
  }

  const client = await pool.connect();
  try {
    console.log("Postgres connected. Checking if schema initialization is needed...");
    
    const tableCheck = await client.query("SELECT 1 FROM information_schema.tables WHERE table_name = 'users' LIMIT 1");
    
    if (tableCheck.rows.length === 0) {
        console.log("Schema not found. Initializing...");
        const schemaPath = path.join(__dirname, '../../backups/health-care-ai-main/database_schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schema);
            console.log("Database schema initialized successfully.");
        } else {
            console.warn("Schema file not found at:", schemaPath);
        }
    } else {
        console.log("Database schema already exists. Skipping initialization.");
    }
  } catch (err: any) {
    console.error('Database initialization error:', err.message);
  } finally {
    client.release();
  }
};

initDb();
