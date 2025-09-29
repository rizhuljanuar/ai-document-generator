import { Elysia } from 'elysia'
import { DocumentationController } from '../controllers/DocumentationController'

export function createDocumentationRoutes(service: DocumentationService): Elysia {
  const docController = DocumentationController(service)

  return new Elysia()
    .post('/generate-docs', docController.generateDocs)
    .get('/docs/history', docController.getDocumentationHistory)
    .get('/docs/:id', docController.getDocumentationById)
    .get('/stats', docController.getStats)
    .get('/test-ai', docController.testAI)
}