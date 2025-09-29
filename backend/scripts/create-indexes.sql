-- Create indexes for documentation_history table
-- Run this in your Supabase SQL Editor

-- Index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_id ON documentation_history(user_id);

-- Index on created_at for sorting and filtering (descending)
CREATE INDEX IF NOT EXISTS idx_documentation_history_created_at ON documentation_history(created_at DESC);

-- Index on language for filtering by language
CREATE INDEX IF NOT EXISTS idx_documentation_history_language ON documentation_history(language);

-- Index on style for filtering by style
CREATE INDEX IF NOT EXISTS idx_documentation_history_style ON documentation_history(style);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_created ON documentation_history(user_id, created_at DESC);

-- Add a comment for documentation
COMMENT ON TABLE documentation_history IS 'Stores generated documentation history for the AI Document Generator application';