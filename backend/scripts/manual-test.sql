-- Manual test for Supabase connection
-- This is to help troubleshoot connection issues

-- Test the connection string format:
-- The Supabase URL should be converted to a proper PostgreSQL connection string

-- Original URL: https://oqlcwbsjioxibowrkjhn.supabase.co
-- Converted URL: postgresql://postgres:[password]@db.oqlcwbsjioxibowrkjhn.supabase.co:5432/postgres

-- You can test this manually using psql:
-- psql "postgresql://postgres:[password]@db.oqlcwbsjioxibowrkjhn.supabase.co:5432/postgres?sslmode=require"

-- Common connection string formats:
-- 1. With password: postgresql://postgres:[password]@db.project.supabase.co:5432/postgres
-- 2. anon key format: postgresql://postgres:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
-- 3. Service role key: postgresql://postgres:[service_role_key]@db.project.supabase.co:5432/postgres

-- Check your Supabase dashboard for:
-- 1. Database settings → Connection string
-- 2. Use the "URI" format for direct PostgreSQL connection