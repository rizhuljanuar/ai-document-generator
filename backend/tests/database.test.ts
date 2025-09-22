import { db, sql } from '../src/database/db'
import { documentationHistory } from '../src/database/schema'
import { eq } from 'drizzle-orm'

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // This will be called by the main server startup
  })

  test('should connect to database', async () => {
    // Test connection with a simple query
    const result = await db.select({ count: sql`count(*)` }).from(sql`(SELECT 1) as temp`).limit(1)
    expect(result).toBeDefined()
    expect(result.length).toBe(1)
  })

  test('should insert and retrieve documentation history', async () => {
    // Test data
    const testDoc = {
      id: 'test-doc-id',
      user_id: 'user-123',
      original_code: 'const test = () => { return "hello"; }',
      generated_docs: '/**\n * Test function\n * @returns {string} Hello message\n */',
      language: 'javascript',
      style: 'jsdoc'
    }

    // Insert test data
    const [inserted] = await db.insert(documentationHistory).values(testDoc).returning()
    expect(inserted.id).toBe(testDoc.id)

    // Retrieve test data
    const retrieved = await db
      .select()
      .from(documentationHistory)
      .where(eq(documentationHistory.id, testDoc.id))
      .limit(1)

    expect(retrieved.length).toBe(1)
    expect(retrieved[0].original_code).toBe(testDoc.original_code)
    expect(retrieved[0].generated_docs).toBe(testDoc.generated_docs)

    // Clean up
    await db.delete(documentationHistory).where(eq(documentationHistory.id, testDoc.id))
  })

  test('should have proper table structure', async () => {
    // Check if table exists and has correct columns
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'documentation_history'
      ORDER BY ordinal_position
    `)

    const columns = result.rows
    const columnNames = columns.map(col => col.column_name)

    expect(columnNames).toContain('id')
    expect(columnNames).toContain('original_code')
    expect(columnNames).toContain('generated_docs')
    expect(columnNames).toContain('language')
    expect(columnNames).toContain('style')
    expect(columnNames).toContain('created_at')
    expect(columnNames).toContain('user_id')
  })
})