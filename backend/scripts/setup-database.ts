#!/usr/bin/env bun

import { db, sql } from '../src/database/db'
import { documentationHistory } from '../src/database/schema'

/**
 * Database Setup Script
 * This script creates necessary indexes and constraints for the documentation_history table
 */

async function setupDatabase() {
  console.log('🚀 Starting database setup...')

  try {
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'documentation_history'
      )
    `)

    if (!tableExists.rows[0].exists) {
      console.log('❌ documentation_history table does not exist. Please run migrations first.')
      process.exit(1)
    }

    // Create indexes for better performance
    console.log('📊 Creating indexes for better performance...')

    // Index on user_id (for user-specific queries)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documentation_history_user_id
      ON documentation_history(user_id)
    `)

    // Index on created_at (for sorting and filtering)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documentation_history_created_at
      ON documentation_history(created_at DESC)
    `)

    // Index on language (for filtering by language)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documentation_history_language
      ON documentation_history(language)
    `)

    // Index on style (for filtering by style)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documentation_history_style
      ON documentation_history(style)
    `)

    // Composite index for common query patterns
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_documentation_history_user_created
      ON documentation_history(user_id, created_at DESC)
    `)

    console.log('✅ Database setup completed successfully!')
    console.log('📋 Created indexes:')
    console.log('   - idx_documentation_history_user_id')
    console.log('   - idx_documentation_history_created_at')
    console.log('   - idx_documentation_history_language')
    console.log('   - idx_documentation_history_style')
    console.log('   - idx_documentation_history_user_created')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()