#!/usr/bin/env bun

// Test script for AI integration

import { DocumentationService } from '../src/services/DocumentationService'
import { DocumentationRepository } from '../src/repositories/DocumentationRepository'

console.log('🤖 Testing AI Integration...')

async function runTests() {
  const repository = new DocumentationRepository()
  const service = new DocumentationService(repository)

  // Test 1: AI Service Connection
  console.log('\n🔍 Test 1: AI Service Connection')
  try {
    const aiTest = await service.testAIService()
    if (aiTest.connected) {
      console.log('✅ AI service connection successful')
      console.log(`   Model: ${aiTest.model}`)
      console.log(`   Response time: ${aiTest.responseTime}ms`)
    } else {
      console.log('❌ AI service connection failed')
      console.log('   Make sure OPENAI_API_KEY is set in .env file')
      return
    }
  } catch (error) {
    console.error('❌ AI service test failed:', error)
    return
  }

  // Test 2: Sample Documentation Generation
  console.log('\n📝 Test 2: Sample Documentation Generation')
  const sampleCode = `
const calculateSum = (a, b) => {
  return a + b
}

const multiply = (x, y) => {
  return x * y
}

// Main function
function main() {
  const result1 = calculateSum(5, 3)
  const result2 = multiply(4, 6)
  console.log(\`Sum: \${result1}, Product: \${result2}\`)
  return result1 + result2
}

module.exports = { calculateSum, multiply, main }
`

  try {
    const result = await service.generateDocumentation({
      code: sampleCode,
      language: 'javascript',
      style: 'jsdoc',
      userId: 'test-user'
    })

    if (result.success) {
      console.log('✅ Documentation generation successful')
      console.log(`   Generated ${result.documentation.length} characters`)
      console.log('   Sample documentation:')
      console.log('   ' + result.documentation.substring(0, 200) + '...')
    } else {
      console.log('❌ Documentation generation failed')
    }
  } catch (error) {
    console.error('❌ Documentation generation failed:', error)
  }

  // Test 3: Different Languages and Styles
  console.log('\n🌐 Test 3: Different Languages and Styles')
  const testCases = [
    { language: 'python', style: 'markdown' },
    { language: 'typescript', style: 'jsdoc' },
    { language: 'java', style: 'inline' }
  ]

  for (const testCase of testCases) {
    console.log(`\n   Testing ${testCase.language} with ${testCase.style} style...`)
    try {
      const result = await service.generateDocumentation({
        code: `function test() { return "hello"; }`,
        language: testCase.language,
        style: testCase.style,
        userId: 'test-user'
      })

      if (result.success) {
        console.log(`   ✅ Generated ${result.documentation.length} characters`)
      } else {
        console.log(`   ❌ Failed`)
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Test 4: Error Cases
  console.log('\n⚠️ Test 4: Error Handling')
  try {
    await service.generateDocumentation({
      code: '',
      language: 'javascript',
      style: 'jsdoc',
      userId: 'test-user'
    })
    console.log('❌ Should have failed with empty code')
  } catch (error) {
    console.log('✅ Properly handled empty code:', error instanceof Error ? error.message : 'Unknown error')
  }

  console.log('\n🎉 AI Integration Tests Complete!')
}

runTests().catch(console.error)