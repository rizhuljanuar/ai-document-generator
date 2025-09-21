import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { DocumentationController } from './controllers/DocumentationController'
import { DocumentationService } from './services/DocumentationService'
import { DocumentationRepository } from './repositories/DocumentationRepository'

const app = new Elysia()
  .use(cors())
  .get('/', () => ({ status: 'API is running' }))
  .group('/api', (app) =>
    app.use(DocumentationController(new DocumentationService(new DocumentationRepository())))
  )
  .listen(3001)

console.log('🚀 Backend server running on http://localhost:3001')