const Database = require("better-sqlite3");

// Connect to the database (will create if it doesn't exist)
const db = new Database("data.db");

// Optional: Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

module.exports = db;
