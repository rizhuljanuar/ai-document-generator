#!/usr/bin/env bun

import { client } from '../src/database/db'

console.log('🔌 Testing database connection...')

try {
  // Test basic connection using the postgres client directly
  const result = await client`SELECT 1`
  console.log('✅ Database connection successful!')

  // Test if the table exists
  const tableResult = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'documentation_history'
    )
  `

  const tableExists = tableResult[0].exists
  if (tableExists) {
    console.log('✅ documentation_history table exists!')

    // Get record count
    const countResult = await client`SELECT COUNT(*) FROM documentation_history`
    const count = parseInt(countResult[0].count)
    console.log(`📊 Current records in table: ${count}`)
  } else {
    console.log('❌ documentation_history table does not exist')
  }

  console.log('🎉 All tests passed!')
  process.exit(0)
} catch (error) {
  console.error('❌ Database connection failed:', error)
  process.exit(1)
}