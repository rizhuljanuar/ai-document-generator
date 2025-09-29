import { DocumentationService } from '../services/DocumentationService'

export function HealthController(service: DocumentationService) {
  return {
    getHealth: async ({ set }) => {
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
        set.status = 500
        return {
          success: false,
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }
}