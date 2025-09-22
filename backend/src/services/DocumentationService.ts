import { GenerateDocsRequest, GenerateDocsResponse } from '../types'
import { AIService } from './AIService'
import { DocumentationRepository } from '../repositories/DocumentationRepository'
import { generateDocsSchema, GenerateDocsInput } from '../utils/validation'

export class DocumentationService {
  private aiService: AIService
  private repository: DocumentationRepository

  constructor(repository: DocumentationRepository) {
    this.aiService = new AIService()
    this.repository = repository
  }

  async generateDocumentation(request: GenerateDocsRequest): Promise<GenerateDocsResponse> {
    try {
      // Validate input
      const validatedInput = this.validateInput(request)

      // Save documentation request to database
      const savedDoc = await this.repository.saveDocumentation(validatedInput)

      try {
        // Generate documentation using AI
        const aiResponse = await this.aiService.generateDocumentation(
          validatedInput.code,
          validatedInput.language,
          validatedInput.style
        )

        // Save the generated documentation
        await this.repository.updateDocumentation(savedDoc.id, aiResponse.documentation)

        return {
          success: true,
          documentation: aiResponse.documentation
        }
      } catch (error) {
        // If AI generation fails, save the error but don't fail the request
        await this.repository.updateDocumentation(savedDoc.id, 'Error generating documentation')
        throw error
      }
    } catch (error) {
      console.error('Error in DocumentationService:', error)
      throw error
    }
  }

  private validateInput(request: GenerateDocsRequest): GenerateDocsInput {
    try {
      return generateDocsSchema.parse(request)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        throw new Error(`Validation failed: ${errorMessages.join(', ')}`)
      }
      throw error
    }
  }

  async getDocumentationHistory(userId?: string): Promise<any[]> {
    try {
      return await this.repository.getDocumentationHistory(userId, 20)
    } catch (error) {
      console.error('Error fetching documentation history:', error)
      throw new Error('Failed to fetch documentation history')
    }
  }

  async getDocumentationById(id: string): Promise<any> {
    try {
      const doc = await this.repository.getDocumentationById(id)
      if (!doc) {
        throw new Error('Documentation not found')
      }
      return doc
    } catch (error) {
      console.error('Error fetching documentation:', error)
      throw error
    }
  }
}