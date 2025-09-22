import { AIServiceResponse } from '../types'

export class AIService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY!
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }
  }

  async generateDocumentation(code: string, language: string, style: string): Promise<AIServiceResponse> {
    try {
      const prompt = this.buildPrompt(code, language, style)

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`AI service failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from AI service')
      }

      const documentation = data.candidates[0].content.parts[0].text

      return {
        documentation: documentation.trim()
      }
    } catch (error) {
      console.error('Error generating documentation:', error)
      throw new Error(`Failed to generate documentation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private buildPrompt(code: string, language: string, style: string): string {
    const styleInstructions = this.getStyleInstructions(style)

    return `You are an expert code documentation generator. Generate professional documentation for the following ${language} code.

Code:
\`\`\`${language}
${code}
\`\`\`

Requirements:
${styleInstructions}

Please generate the documentation in a clean, readable format. Only return the documentation content without any additional explanations or markdown formatting.

Documentation:`
  }

  private getStyleInstructions(style: string): string {
    switch (style) {
      case 'jsdoc':
        return `Generate JSDoc-style documentation following these rules:
- Use /** ... */ block format
- Include @param tags for all function parameters with type and description
- Include @returns tag for functions
- Include @description tag for high-level explanations
- Include @type tags for variables and constants
- Use proper indentation and formatting`

      case 'inline':
        return `Generate inline comments following these rules:
- Use // for single-line comments
- Use /* */ for multi-line comments
- Place comments before the code they document
- Explain what the code does, not how it does it
- Include type information where relevant
- Use proper indentation and formatting`

      case 'markdown':
        return `Generate Markdown-style documentation following these rules:
- Use proper Markdown syntax (# for headings, ** for bold, \` for code)
- Include section headers for different parts of the code
- Use code blocks (\`\`\`) for examples
- Explain the purpose and usage of each component
- Include examples where helpful
- Structure documentation clearly with headers and sub-headers`

      default:
        return `Generate clean, professional documentation that is easy to understand and maintain.`
    }
  }
}