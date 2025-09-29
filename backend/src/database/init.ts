import { db } from './db'
import { sql } from 'drizzle-orm'

export async function initializeDatabase() {
  try {
    // Test database connection using a simpler approach
    await db.execute(sql`SELECT 1`)
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}