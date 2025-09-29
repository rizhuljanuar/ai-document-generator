import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { eq, desc } from 'drizzle-orm'

const connectionString = process.env.SUPABASE_DB_URL!

let client: any = null
let drizzleDb: any = null

if (connectionString) {
  try {
    // Use service role key for database connection if available
    let finalConnectionString = connectionString
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Extract the password from the original connection string
      const urlMatch = connectionString.match(/postgresql:\/\/([^:@]+):([^@]+)@/)
      if (urlMatch) {
        const password = urlMatch[2]
        finalConnectionString = `postgresql://postgres.oqlcwbsjioxibowrkjhn:${password}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`
      }
    }

    console.log('🔗 Attempting to connect to:', finalConnectionString.replace(/:([^:]+)@/, ':****@'))

    // Create a connection with proper configuration
    client = postgres(finalConnectionString, {
      max: 1,
      idle_timeout: 30,
      connect_timeout: 20,
      ssl: { rejectUnauthorized: false }
    })

    drizzleDb = drizzle(client, { schema })
    console.log('✅ Database connection initialized successfully')
  } catch (error) {
    console.log('⚠️  Database connection failed, running in test mode:', error.message)
    console.log('💡 Make sure your Supabase database is accessible')
  }
} else {
  console.log('⚠️  No SUPABASE_DB_URL provided, running in test mode')
}

export const sql = client
export const db = drizzleDb

export { schema, eq, desc, client }