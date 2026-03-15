-- Rate limiting table for brute-force protection
CREATE TABLE IF NOT EXISTS rate_limit (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  key   TEXT    NOT NULL,
  ts    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_key_ts ON rate_limit(key, ts);
