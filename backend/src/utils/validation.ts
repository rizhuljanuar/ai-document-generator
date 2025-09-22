import { z } from 'zod'

export const generateDocsSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10000, 'Code must be less than 10,000 characters'),
  language: z.enum(['javascript', 'python', 'java', 'cpp', 'typescript', 'php', 'golang', 'rust'], {
    errorMap: () => ({ message: 'Please select a valid programming language' })
  }),
  style: z.enum(['jsdoc', 'inline', 'markdown'], {
    errorMap: () => ({ message: 'Please select a valid documentation style' })
  }),
  userId: z.string().optional()
})

export type GenerateDocsInput = z.infer<typeof generateDocsSchema>