-- Add phone_normalized to telegram_pending so we can look up chat_id by phone
-- even before telegram_contacts table exists
ALTER TABLE telegram_pending ADD COLUMN phone_normalized TEXT;
CREATE INDEX IF NOT EXISTS idx_tg_pending_phone ON telegram_pending(phone_normalized);
