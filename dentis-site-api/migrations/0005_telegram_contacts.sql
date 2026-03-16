-- Окрема таблиця phone → telegram chat_id (незалежно від записів)
CREATE TABLE IF NOT EXISTS telegram_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  chat_id TEXT NOT NULL,
  first_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
