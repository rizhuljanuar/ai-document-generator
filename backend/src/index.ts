import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { DocumentationController } from './controllers/DocumentationController'
import { DocumentationService } from './services/DocumentationService'
import { DocumentationRepository } from './repositories/DocumentationRepository'
import { initializeDatabase } from './database/init'

const port = process.env.PORT || 3001

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase()

    const repository = new DocumentationRepository()
    const service = new DocumentationService(repository)

    const app = new Elysia()
      .use(cors())
      .get('/', () => ({
        status: 'API is running',
        timestamp: new Date().toISOString()
      }))
      .group('/api', (app) =>
        app.use(DocumentationController(service))
      )
      .listen({ port })

    console.log(`🚀 Backend server running on http://localhost:${port}`)
    console.log(`📝 Swagger docs available at http://localhost:${port}/swagger`)

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()