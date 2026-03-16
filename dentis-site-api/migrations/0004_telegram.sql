-- Telegram chat_id for patients (linked by phone number)
ALTER TABLE appointments ADD COLUMN telegram_chat_id TEXT;
ALTER TABLE appointments ADD COLUMN tg_reminded_24h INTEGER DEFAULT 0;
ALTER TABLE appointments ADD COLUMN tg_reminded_1h INTEGER DEFAULT 0;

-- Telegram bot webhook state (stores pending /start registrations)
CREATE TABLE IF NOT EXISTS telegram_pending (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
