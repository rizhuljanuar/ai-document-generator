-- Manual table creation for documentation_history
-- Run this in your Supabase SQL Editor

-- Drop table if exists (for testing purposes only)
-- DROP TABLE IF EXISTS documentation_history CASCADE;

-- Create the documentation_history table
CREATE TABLE IF NOT EXISTS documentation_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    original_code TEXT NOT NULL,
    generated_docs TEXT NOT NULL,
    language TEXT NOT NULL,
    style TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comments for documentation
COMMENT ON TABLE documentation_history IS 'Stores generated documentation history for the AI Document Generator application';
COMMENT ON COLUMN documentation_history.id IS 'Unique identifier for each documentation record';
COMMENT ON COLUMN documentation_history.user_id IS 'Optional user identifier for future authentication';
COMMENT ON COLUMN documentation_history.original_code IS 'The original code submitted by the user';
COMMENT ON COLUMN documentation_history.generated_docs IS 'The AI-generated documentation';
COMMENT ON COLUMN documentation_history.language IS 'Programming language of the code';
COMMENT ON COLUMN documentation_history.style IS 'Documentation style used (jsdoc, inline, markdown)';
COMMENT ON COLUMN documentation_history.created_at IS 'Timestamp when the record was created';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_id ON documentation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_documentation_history_created_at ON documentation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_history_language ON documentation_history(language);
CREATE INDEX IF NOT EXISTS idx_documentation_history_style ON documentation_history(style);
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_created ON documentation_history(user_id, created_at DESC);

-- Verify table creation
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'documentation_history'
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'documentation_history';