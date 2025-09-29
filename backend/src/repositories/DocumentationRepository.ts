import { db } from '../database/db'
import { documentationHistory } from '../database/schema'
import { GenerateDocsRequest, DocumentationHistory } from '../types'
import { eq, desc } from 'drizzle-orm'

export class DocumentationRepository {
  async saveDocumentation(request: GenerateDocsRequest): Promise<DocumentationHistory> {
    if (!db) {
      throw new Error('Database connection not established')
    }

    const newRecord = {
      user_id: request.userId || null,
      original_code: request.code,
      generated_docs: '',
      language: request.language,
      style: request.style
    }

    const [created] = await db.insert(documentationHistory).values(newRecord).returning()

    return created
  }

  async updateDocumentation(id: string, documentation: string): Promise<DocumentationHistory | undefined> {
    if (!db) {
      throw new Error('Database connection not established')
    }

    const [updated] = await db
      .update(documentationHistory)
      .set({ generated_docs: documentation })
      .where(eq(documentationHistory.id, id))
      .returning()

    return updated
  }

  async getDocumentationHistory(userId?: string, limit = 10): Promise<DocumentationHistory[]> {
    if (!db) {
      throw new Error('Database connection not established')
    }

    let query = db.select().from(documentationHistory)

    if (userId) {
      query = query.where(eq(documentationHistory.user_id, userId))
    }

    return query
      .orderBy(desc(documentationHistory.created_at))
      .limit(limit)
  }

  async getDocumentationById(id: string): Promise<DocumentationHistory | undefined> {
    if (!db) {
      throw new Error('Database connection not established')
    }

    return db
      .select()
      .from(documentationHistory)
      .where(eq(documentationHistory.id, id))
      .limit(1)
  }
}