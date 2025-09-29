import { DocumentationService } from '../services/DocumentationService'
import { GenerateDocsRequest } from '../types'

export function DocumentationController(service: DocumentationService) {
  return {
    generateDocs: async ({ body, set }) => {
      try {
        const result = await service.generateDocumentation(body as GenerateDocsRequest)
        return result
      } catch (error) {
        console.error('Error in generate docs handler:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        set.status = 500
        return {
          success: false,
          documentation: `Error: ${errorMessage}`
        }
      }
    },

    getDocumentationHistory: async ({ query, set }) => {
      try {
        const userId = query.userId ? String(query.userId) : undefined
        const limit = query.limit ? parseInt(String(query.limit)) : 20
        const history = await service.getDocumentationHistory(userId, limit)
        return { success: true, history }
      } catch (error) {
        console.error('Error fetching documentation history:', error)
        set.status = 500
        return { success: false, error: 'Failed to fetch documentation history' }
      }
    },

    getDocumentationById: async ({ params, set }) => {
      try {
        const documentation = await service.getDocumentationById(String(params.id))
        return { success: true, documentation }
      } catch (error) {
        console.error('Error fetching documentation:', error)
        set.status = 404
        return { success: false, error: 'Documentation not found' }
      }
    },

    getStats: async ({ set }) => {
      try {
        const stats = await service.getGenerationStats()
        return { success: true, stats }
      } catch (error) {
        console.error('Error fetching stats:', error)
        set.status = 500
        return { success: false, error: 'Failed to fetch statistics' }
      }
    },

    testAI: async ({ set }) => {
      try {
        const result = await service.testAIService()
        return { success: true, ...result }
      } catch (error) {
        console.error('Error testing AI service:', error)
        set.status = 500
        return {
          success: false,
          connected: false,
          model: 'gpt-3.5-turbo',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }
}