-- Add slug column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (allowing nulls)
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_slug ON documents (slug) WHERE slug IS NOT NULL;

-- Backfill slugs for existing documents
UPDATE documents
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL;
