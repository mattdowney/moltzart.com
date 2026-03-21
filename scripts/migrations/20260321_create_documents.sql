-- Create documents table for agent-uploaded markdown documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents (category);

-- Index for newest-first listing
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at DESC);
