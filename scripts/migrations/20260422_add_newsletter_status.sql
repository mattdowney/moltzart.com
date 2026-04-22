-- Newsletter articles can now be ingested as 'candidate' when Pica would
-- otherwise skip them for a soft failure (e.g. unresolvable tracker URL).
-- Matt reviews candidates in /admin/newsletter and clicks Send to OS on
-- the ones that pan out.
ALTER TABLE newsletter_articles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ingested';

CREATE INDEX IF NOT EXISTS newsletter_articles_status_idx ON newsletter_articles (status);
