export interface GenerateDocsRequest {
  code: string
  language: string
  style: string
  userId?: string
}

export interface GenerateDocsResponse {
  success: boolean
  documentation: string
}

export interface DocumentationHistory {
  id: string
  user_id?: string
  original_code: string
  generated_docs: string
  language: string
  style: string
  created_at: Date
}

export interface AIServiceResponse {
  documentation: string
}