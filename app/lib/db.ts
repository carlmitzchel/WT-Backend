import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
let db: Database<sqlite3.Database> | null = null;

async function openDb() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), "blog.sqlite");
    console.log(`Attempting to open database at: ${dbPath}`);

    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      console.log("Database connection established");
      await initializeDb();
    } catch (error) {
      console.error("Error opening database:", error);
      throw error;
    }
  }
  return db;
}

async function initializeDb() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      post_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      author_name TEXT
    );

    CREATE TABLE IF NOT EXISTS comments (
      comment_id TEXT PRIMARY KEY,
      post_id INTEGER,
      commenter_name TEXT,
      comment_body TEXT,
      FOREIGN KEY (post_id) REFERENCES posts (post_id)
    );
  `);

  console.log("Database initialized successfully");
}

export { openDb };
