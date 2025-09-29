#!/usr/bin/env bun

// Simple script to test connection and create table if not exists

console.log('🔍 Testing database connection and creating table...')

const createTableSQL = `
CREATE TABLE IF NOT EXISTS documentation_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    original_code TEXT NOT NULL,
    generated_docs TEXT NOT NULL,
    language TEXT NOT NULL,
    style TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_id ON documentation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_documentation_history_created_at ON documentation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_history_language ON documentation_history(language);
CREATE INDEX IF NOT EXISTS idx_documentation_history_style ON documentation_history(style);

-- Insert test data
INSERT INTO documentation_history (user_id, original_code, generated_docs, language, style)
VALUES (
    'test-connection',
    'const test = () => { return "connection successful"; }',
    '/**\n * Test connection function\n * @returns {string} Connection success message\n */',
    'javascript',
    'jsdoc'
)
ON CONFLICT (id) DO NOTHING;

-- Check if table exists and has data
const result = await client\`
    SELECT
        EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = 'documentation_history'
        ) as table_exists,
        COUNT(*) as record_count
    FROM documentation_history
\`

console.log('📊 Result:', result[0])

// Clean up test data
await client\`DELETE FROM documentation_history WHERE user_id = 'test-connection'\`

console.log('✅ Table setup completed successfully!')