-- Files table for Vercel Blob storage metadata
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  size BIGINT NOT NULL DEFAULT 0,
  content_type TEXT,
  uploader TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_files_created_at ON files (created_at DESC);
