import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const documentationHistory = pgTable('documentation_history', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  user_id: text('user_id'),
  original_code: text('original_code').notNull(),
  generated_docs: text('generated_docs').notNull(),
  language: text('language').notNull(),
  style: text('style').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})