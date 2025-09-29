export interface AIServiceResponse {
  documentation: string
}

export class OpenAIService {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY!
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      throw new Error('OPENAI_API_KEY is required. Please get your API key from https://platform.openai.com/api-keys')
    }
  }

  async generateDocumentation(code: string, language: string, style: string): Promise<AIServiceResponse> {
    try {
      const prompt = this.buildPrompt(code, language, style)

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert code documentation generator with deep knowledge of ${language} programming. Generate clean, professional documentation based on the user's requirements.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.3,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      const documentation = data.choices[0]?.message?.content || 'No documentation generated.'

      return {
        documentation: this.cleanDocumentation(documentation, style)
      }
    } catch (error) {
      console.error('Error generating documentation with OpenAI:', error)
      throw error
    }
  }

  private buildPrompt(code: string, language: string, style: string): string {
    const styleInstructions = this.getStyleInstructions(style, language)
    const languageSpecific = this.getLanguageSpecificInstructions(language)

    return `You are an expert code documentation generator with deep knowledge of ${language} programming.

CODE TO DOCUMENT:
\`\`\`${language}
${code}
\`\`\`

DOCUMENTATION REQUIREMENTS:
${styleInstructions}

LANGUAGE-SPECIFIC GUIDELINES:
${languageSpecific}

Please generate only the documentation content without any introductory text or explanations.`
  }

  private getModelForLanguage(language: string): string {
    // Use GPT-3.5-turbo for all languages
    return 'gpt-3.5-turbo'
  }

  private getStyleInstructions(style: string, language: string): string {
    const baseStyle = style

    switch (baseStyle) {
      case 'jsdoc':
        if (language === 'javascript' || language === 'typescript') {
          return `Generate comprehensive JSDoc documentation:
- Use /** ... */ block format with proper indentation
- Include @param tags for all parameters with {type} and description
- Include @returns tag for functions with {type} and description
- Include @description tag for high-level explanations
- Include @type tags for variables and constants
- Include @example tags with usage examples
- Include @throws tag for exception handling
- Include @since tag for version information
- Follow JSDoc 3.6.0 specification`

        } else if (language === 'java') {
          return `Generate comprehensive Javadoc-style documentation:
- Use /** ... */ block format with proper indentation
- Include @param tags for all parameters with {@link type} and description
- Include @return tag for methods with {@link type} and description
- Include @description tag for high-level explanations
- Include @type tags for variables and constants
- Include @example tag with usage examples
- Include @throws tag for exception handling
- Include @since tag for version information
- Follow Javadoc conventions`

        } else {
          return `Generate documentation in ${language} standard comment style:
- Use appropriate comment syntax for ${language}
- Document all parameters with types and descriptions
- Document return values with types and descriptions
- Include high-level descriptions
- Follow ${language} documentation best practices`
        }

      case 'inline':
        return `Generate detailed inline comments:
- Use // for single-line comments and /* */ for multi-line comments
- Place comments before the code they document
- Explain what the code does, not how it does it
- Include type information where relevant
- Include usage examples and edge cases
- Use proper indentation and formatting
- Focus on clarity and maintainability`

      case 'markdown':
        return `Generate comprehensive Markdown documentation:
- Use proper Markdown syntax (# for headings, ** for bold, \` for code)
- Include section headers for different parts of the code
- Use code blocks (\`\`\`) for examples and important snippets
- Explain the purpose, usage, and behavior of each component
- Include examples where helpful
- Structure documentation clearly with headers and sub-headers
- Add tables for complex data structures
- Include badges for important information`

      default:
        return `Generate clean, professional documentation that is easy to understand and maintain.`
    }
  }

  private getLanguageSpecificInstructions(language: string): string {
    switch (language) {
      case 'javascript':
        return `JavaScript-specific guidelines:
- Use JSDoc format for functions and classes
- Document async functions with @async and @returns {Promise<type>}
- Document callbacks with @callback
- Document events with @event and @fires
- Document modules with @module and @exports
- Follow JavaScript ES6+ conventions
- Document destructuring parameters
- Document spread operator usage`

      case 'typescript':
        return `TypeScript-specific guidelines:
- Include type information in all documentation
- Use @type tags for interfaces and types
- Document generic types with @typeparam
- Document overloads with @overload
- Document access modifiers (public, private, protected)
- Document decorators with @decorator
- Document async/await patterns
- Follow TypeScript best practices`

      case 'python':
        return `Python-specific guidelines:
- Use Google-style docstrings format
- Include Args section for parameters
- Include Returns section for return values
- Include Raises section for exceptions
- Include Examples section with doctest format
- Use type hints in function signatures
- Document class inheritance
- Document magic methods (__init__, __str__, etc.)`

      case 'java':
        return `Java-specific guidelines:
- Use Javadoc format with /** ... */
- Include @param tags for all parameters
- Include @return tags for methods
- Include @throws tags for exceptions
- Include @since tags for version information
- Document interfaces and abstract classes
- Document annotations and their usage
- Follow Java naming conventions`

      case 'php':
        return `PHP-specific guidelines:
- Use PHPDoc format with /** ... */
- Include @param tags with type hints
- Include @return tags with return types
- Include @throws tags for exceptions
- Include @since tags for version information
- Document class properties and methods
- Document namespaces and use statements
- Follow PSR-12 coding standards`

      case 'golang':
        return `Go-specific guidelines:
- Use godoc format with // comments
- Document exported functions, types, and methods
- Document package-level variables
- Include example functions with // Example comments
- Document error returns explicitly
- Document concurrency patterns (goroutines, channels)
- Follow Go naming conventions`

      case 'rust':
        return `Rust-specific guidelines:
- Use rustdoc format with /// comments
- Document public functions, structs, and enums
- Include # Examples section with code examples
- Document lifetimes and generic parameters
- Document unsafe code and its invariants
- Document Result and Option types
- Follow Rust naming conventions`

      case 'cpp':
        return `C++-specific guidelines:
- Use Doxygen-style comments with /// or /**
- Document classes, methods, and functions
- Include @param tags for parameters
- Include @return tags for return values
- Document template parameters with @tparam
- Document const methods and their guarantees
- Document inheritance relationships
- Follow C++ best practices`

      default:
        return `General coding best practices:
- Document the purpose and usage of each component
- Include parameter and return value documentation
- Document error conditions and edge cases
- Follow language-specific conventions
- Ensure documentation is maintainable and up-to-date`
    }
  }

  private cleanDocumentation(documentation: string, style: string): string {
    let cleaned = documentation.trim()

    // Remove introductory text
    cleaned = cleaned.replace(/^Here is the documentation:/i, '')
    cleaned = cleaned.replace(/^Documentation:/i, '')
    cleaned = cleaned.replace(/^Here.*?documentation:/i, '')

    // Remove trailing explanations
    cleaned = cleaned.replace(/^[ \t]*Documentation\s*generated.*$/im, '')
    cleaned = cleaned.replace(/^[ \t]*Please.*?documentation.*$/im, '')

    // Remove AI model references
    cleaned = cleaned.replace(/^[ \t]*Generated by.*$/im, '')
    cleaned = cleaned.replace(/^[ \t]*I am an AI language model.*$/im, '')

    // Clean up excessive whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
    cleaned = cleaned.trim()

    return cleaned
  }

  // Test method to verify API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
          max_tokens: 5
        })
      })

      return response.ok
    } catch (error) {
      console.error('OpenAI service connection test failed:', error)
      return false
    }
  }
}