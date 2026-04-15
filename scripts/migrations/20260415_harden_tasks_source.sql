-- Harden tasks.source column: default 'agent', CHECK constraint, no NULLs.
-- Idempotent. Safe to re-run.

BEGIN;

-- Backfill any NULL source values (legacy rows) to 'human' to preserve
-- visibility of pre-hardening operator work.
UPDATE tasks SET source = 'human' WHERE source IS NULL;

-- Enforce NOT NULL (DEFAULT 'human' from plan 001 already applied; flip to 'agent').
ALTER TABLE tasks ALTER COLUMN source SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN source SET DEFAULT 'agent';

-- CHECK constraint: only three allowed values. Drop-then-add for idempotency.
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_source_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_source_check
  CHECK (source IN ('human', 'agent', 'cron'));

COMMIT;
