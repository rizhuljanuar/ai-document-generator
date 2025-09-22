import { db, sql } from './db'

export async function initializeDatabase() {
  try {
    // Test database connection using a simple query
    await db.select({ count: sql`count(*)` }).from(sql`(SELECT 1) as temp`).limit(1)
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}