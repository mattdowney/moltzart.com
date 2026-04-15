-- Add source column so the task board can filter out cron-created rows.
-- Existing rows default to 'human'. The ingest API accepts an optional `source`
-- field; when agents invoke task helper scripts without the --agent-task flag
-- no row is created at all, but the filter here is the last line of defense.
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'human';

CREATE INDEX IF NOT EXISTS tasks_source_idx ON tasks (source);
