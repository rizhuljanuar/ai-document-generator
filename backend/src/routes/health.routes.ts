import { Elysia } from 'elysia'
import { HealthController } from '../controllers/HealthController'

export function createHealthRoutes(service: DocumentationService): Elysia {
  const healthController = HealthController(service)

  return new Elysia()
    .get('/health', healthController.getHealth)
}