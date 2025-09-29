import { Elysia } from 'elysia'
import { DocumentationService } from '../services/DocumentationService'
import { GenerateDocsRequest, GenerateDocsResponse } from '../types'

export function DocumentationController(service: DocumentationService) {
  return new Elysia()
    .get('/health', async () => {
      try {
        const aiTest = await service.testAIService()
        return {
          success: true,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          aiService: aiTest,
          database: 'connected'
        }
      } catch (error) {
        return {
          success: false,
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
    .post('/generate-docs', async ({ body }) => {
      try {
        const result: GenerateDocsResponse = await service.generateDocumentation(body)
        return result
      } catch (error) {
        console.error('Error in DocumentationController:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
          success: false,
          documentation: `Error: ${errorMessage}`
        }
      }
    })
    .get('/docs/history', async ({ query }) => {
      try {
        const userId = query.userId ? String(query.userId) : undefined
        const limit = query.limit ? parseInt(String(query.limit)) : 20
        const history = await service.getDocumentationHistory(userId, limit)
        return { success: true, history }
      } catch (error) {
        console.error('Error fetching documentation history:', error)
        return { success: false, error: 'Failed to fetch documentation history' }
      }
    })
    .get('/docs/:id', async ({ params }) => {
      try {
        const documentation = await service.getDocumentationById(String(params.id))
        return { success: true, documentation }
      } catch (error) {
        console.error('Error fetching documentation:', error)
        return { success: false, error: 'Documentation not found' }
      }
    })
    .get('/stats', async () => {
      try {
        const stats = await service.getGenerationStats()
        return { success: true, stats }
      } catch (error) {
        console.error('Error fetching stats:', error)
        return { success: false, error: 'Failed to fetch statistics' }
      }
    })
    .get('/test-ai', async () => {
      try {
        const result = await service.testAIService()
        return { success: true, ...result }
      } catch (error) {
        console.error('Error testing AI service:', error)
        return {
          success: false,
          connected: false,
          model: 'gpt-3.5-turbo',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
}