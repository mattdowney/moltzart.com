-- Track which model each cron job runs on so the calendar UI can surface it.
-- Populated via push-cron-telemetry.sh from openclaw cron payload.model.
ALTER TABLE cron_jobs
  ADD COLUMN IF NOT EXISTS model TEXT;
