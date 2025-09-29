# Manual Setup for Supabase Table

## Problem
Tabel `documentation_history` tidak muncul di Supabase meskipun migration sudah dijalankan.

## Solusi Manual

### Langkah 1: Buka SQL Editor di Supabase Dashboard

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project `oqlcwbsjioxibowrkjhn`
3. Klik menu "SQL Editor"
4. Pilih "New query" atau "Query editor"

### Langkah 2: Run SQL untuk Membuat Tabel

Copy dan paste kode SQL berikut ke SQL Editor:

```sql
-- Hapus tabel jika sudah ada (untuk testing)
-- DROP TABLE IF EXISTS documentation_history CASCADE;

-- Buat tabel documentation_history
CREATE TABLE IF NOT EXISTS documentation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    original_code TEXT NOT NULL,
    generated_docs TEXT NOT NULL,
    language TEXT NOT NULL,
    style TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tambah komentar untuk dokumentasi
COMMENT ON TABLE documentation_history IS 'Stores generated documentation history for the AI Document Generator application';
COMMENT ON COLUMN documentation_history.id IS 'Unique identifier for each documentation record';
COMMENT ON COLUMN documentation_history.user_id IS 'Optional user identifier for future authentication';
COMMENT ON COLUMN documentation_history.original_code IS 'The original code submitted by the user';
COMMENT ON COLUMN documentation_history.generated_docs IS 'The AI-generated documentation';
COMMENT ON COLUMN documentation_history.language IS 'Programming language of the code';
COMMENT ON COLUMN documentation_history.style IS 'Documentation style used (jsdoc, inline, markdown)';
COMMENT ON COLUMN documentation_history.created_at IS 'Timestamp when the record was created';
```

### Langkah 3: Buat Index untuk Performance

Copy dan paste kode berikut untuk membuat index:

```sql
-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_id ON documentation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_documentation_history_created_at ON documentation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_history_language ON documentation_history(language);
CREATE INDEX IF NOT EXISTS idx_documentation_history_style ON documentation_history(style);
CREATE INDEX IF NOT EXISTS idx_documentation_history_user_created ON documentation_history(user_id, created_at DESC);
```

### Langkah 4: Verifikasi Tabel Terbuat

Run query berikut untuk memverifikasi tabel sudah terbuat:

```sql
-- Cek apakah tabel ada
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'documentation_history';

-- Cek struktur tabel
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'documentation_history'
ORDER BY ordinal_position;

-- Cek index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'documentation_history';
```

### Langkah 5: Tes Insert Data

Run query berikut untuk tes insert data:

```sql
-- Insert test data
INSERT INTO documentation_history (user_id, original_code, generated_docs, language, style)
VALUES (
    'test-user',
    'const test = () => { return "hello"; }',
    '/**\n * Test function\n * @returns {string} Hello message\n */',
    'javascript',
    'jsdoc'
);

-- Check inserted data
SELECT * FROM documentation_history;

-- Clean up test data
DELETE FROM documentation_history WHERE user_id = 'test-user';
```

### Alternatif: Gunakan Drizzle Studio

1. Install dan buka Drizzle Studio:
   ```bash
   bun run db:studio
   ```

2. Klik "Add database connection"
3. Gunak connection string dari Supabase:
   ```
   postgresql://postgres:[password]@db.oqlcwbsjioxibowrkjhn.supabase.co:5432/postgres
   ```

4. Connect dan drag schema file untuk membuat tabel

### Masalah Umum

**Jika tabel tidak muncul:**
1. Pastikan Anda sedang di database yang benar di Supabase dashboard
2. Cek permissions untuk schema database
3. Cek apakah ada error saat menjalankan SQL
4. Refresh halaman setelah menjalankan SQL

**Jika error saat insert:**
1. Cek RLS (Row Level Security) settings
2. Cek permission untuk insert operation
3. Cek constraint violations

Setelah tabel berhasil dibuat, Anda bisa mulai menggunakan aplikasi untuk menyimpan data dokumentasi.