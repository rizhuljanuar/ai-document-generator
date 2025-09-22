import { Elysia } from 'elysia'
import { DocumentationService } from '../services/DocumentationService'
import { GenerateDocsRequest, GenerateDocsResponse } from '../types'

export function DocumentationController(service: DocumentationService) {
  return new Elysia()
    .post('/api/generate-docs', async ({ body }: { body: GenerateDocsRequest }) => {
      try {
        const result: GenerateDocsResponse = await service.generateDocumentation(body)
        return result
      } catch (error) {
        console.error('Error in DocumentationController:', error)
        return {
          success: false,
          documentation: 'Error generating documentation. Please try again.'
        }
      }
    }, {
      body: {
        code: String,
        language: String,
        style: String,
        userId: String.optional()
      }
    })
    .get('/api/docs/history', async ({ query }) => {
      try {
        const userId = query.userId ? String(query.userId) : undefined
        const history = await service.getDocumentationHistory(userId)
        return { success: true, history }
      } catch (error) {
        console.error('Error fetching documentation history:', error)
        return { success: false, error: 'Failed to fetch documentation history' }
      }
    })
    .get('/api/docs/:id', async ({ params }) => {
      try {
        const documentation = await service.getDocumentationById(String(params.id))
        return { success: true, documentation }
      } catch (error) {
        console.error('Error fetching documentation:', error)
        return { success: false, error: 'Documentation not found' }
      }
    })
}