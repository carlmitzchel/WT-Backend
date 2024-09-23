import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: "/blog.sqlite",
      driver: sqlite3.Database,
    });
    await initializeDb();
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
