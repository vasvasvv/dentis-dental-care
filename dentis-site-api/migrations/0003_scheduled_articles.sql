-- Черга статей для автопублікації (Cloudflare Cron)
CREATE TABLE IF NOT EXISTS scheduled_articles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  type        TEXT    DEFAULT 'blog',
  badge       TEXT    DEFAULT 'Стаття',
  title       TEXT    NOT NULL,
  desc        TEXT    NOT NULL,
  hot         INTEGER DEFAULT 0,
  publish_at  TEXT    NOT NULL,        -- ISO datetime, UTC
  published   INTEGER DEFAULT 0,       -- 0 = pending, 1 = done
  created_at  TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scheduled_articles_pending
  ON scheduled_articles(published, publish_at);
