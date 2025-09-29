import { GenerateDocsRequest, GenerateDocsResponse } from '../types'
import { OpenAIService } from './OpenAIService'
import { DocumentationRepository } from '../repositories/DocumentationRepository'
import { generateDocsSchema, GenerateDocsInput } from '../utils/validation'
import { z } from 'zod'

export interface GenerationMetrics {
  language: string
  style: string
  inputLength: number
  generationTime: number
  success: boolean
}

export class DocumentationService {
  private aiService: OpenAIService
  private repository: DocumentationRepository

  constructor(repository: DocumentationRepository) {
    this.aiService = new OpenAIService()
    this.repository = repository
  }

  async generateDocumentation(request: GenerateDocsRequest): Promise<GenerateDocsResponse> {
    const startTime = Date.now()
    const generationMetrics: GenerationMetrics = {
      language: request.language,
      style: request.style,
      inputLength: request.code.length,
      generationTime: 0,
      success: false
    }

    try {
      // Validate input
      const validatedInput = this.validateInput(request)

      // Save documentation record to database
      const savedDoc = await this.repository.saveDocumentation(validatedInput)

      try {
        // Generate documentation using AI
        const aiResponse = await this.aiService.generateDocumentation(
          validatedInput.code,
          validatedInput.language,
          validatedInput.style
        )

        // Calculate generation time
        generationMetrics.generationTime = Date.now() - startTime
        generationMetrics.success = true

        // Update the generated documentation in database
        await this.repository.updateDocumentation(savedDoc.id, aiResponse.documentation)

        // Log generation metrics
        console.log(`✅ Generated documentation for ${validatedInput.language} in ${generationMetrics.generationTime}ms`)

        return {
          success: true,
          documentation: aiResponse.documentation
        }
      } catch (error) {
        // Calculate generation time even for failures
        generationMetrics.generationTime = Date.now() - startTime
        generationMetrics.success = false

        // If AI generation fails, save the error but don't fail the request
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ AI generation failed:', errorMessage)
        throw new Error(`Failed to generate documentation: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error in DocumentationService:', error)
      throw error
    }
  }

  async testAIService(): Promise<{ connected: boolean; model: string; responseTime?: number }> {
    try {
      console.log('🔍 Testing AI service connection...')
      const startTime = Date.now()

      const isConnected = await this.aiService.testConnection()
      const responseTime = isConnected ? Date.now() - startTime : undefined

      if (isConnected) {
        console.log('✅ AI service connection successful')
        return {
          connected: true,
          model: 'gpt-3.5-turbo',
          responseTime
        }
      } else {
        console.error('❌ AI service connection failed')
        return {
          connected: false,
          model: 'gpt-3.5-turbo'
        }
      }
    } catch (error) {
      console.error('❌ AI service test failed:', error)
      return {
        connected: false,
        model: 'gpt-3.5-turbo'
      }
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

  async getDocumentationHistory(userId?: string, limit = 20): Promise<any[]> {
    try {
      const history = await this.repository.getDocumentationHistory(userId, limit)

      // Add metadata for each entry
      return history.map(doc => ({
        ...doc,
        generatedAt: doc.created_at,
        codeLength: doc.original_code.length,
        docsLength: doc.generated_docs.length
      }))
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

      return {
        ...doc,
        generatedAt: doc.created_at,
        codeLength: doc.original_code.length,
        docsLength: doc.generated_docs.length
      }
    } catch (error) {
      console.error('Error fetching documentation:', error)
      throw error
    }
  }

  async getGenerationStats(): Promise<{
    totalGenerations: number
    successfulGenerations: number
    averageGenerationTime: number
    languagesGenerated: string[]
    stylesGenerated: string[]
  }> {
    try {
      const allDocs = await this.repository.getDocumentationHistory(undefined, 1000)

      const totalGenerations = allDocs.length
      const successfulGenerations = allDocs.filter(doc => !doc.generated_docs.startsWith('Error')).length
      const failedGenerations = totalGenerations - successfulGenerations

      const generationTimes = allDocs
        .filter(doc => doc.created_at)
        .map(doc => doc.created_at.getTime())

      const averageGenerationTime = generationTimes.length > 0
        ? generationTimes.reduce((sum, time) => sum + time, 0) / generationTimes.length
        : 0

      const languagesGenerated = [...new Set(allDocs.map(doc => doc.language))]
      const stylesGenerated = [...new Set(allDocs.map(doc => doc.style))]

      return {
        totalGenerations,
        successfulGenerations,
        averageGenerationTime,
        languagesGenerated,
        stylesGenerated
      }
    } catch (error) {
      console.error('Error fetching generation stats:', error)
      throw new Error('Failed to fetch generation statistics')
    }
  }
}