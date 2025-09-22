export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate request body
    if (!body.code || !body.language || !body.style) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: code, language, or style'
      })
    }

    // Forward request to backend
    const response = await fetch(`${process.env.API_BASE_URL}/api/generate-docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: body.code,
        language: body.language,
        style: body.style,
        userId: body.userId || null // Optional for future auth
      })
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to generate documentation'
      })
    }

    const data = await response.json()

    return {
      success: true,
      documentation: data.documentation
    }
  } catch (error: any) {
    console.error('Error in generate-docs API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})