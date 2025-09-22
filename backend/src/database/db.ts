import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { eq, desc } from 'drizzle-orm'

const connectionString = process.env.SUPABASE_URL!

export const sql = postgres(connectionString, { max: 1 })
export const db = drizzle(sql, { schema })

export { schema, eq, desc }