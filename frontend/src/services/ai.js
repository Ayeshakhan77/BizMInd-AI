/**
 * BizMind AI — Frontend API & AI Service Bridge
 * Routes all parsed operations and AI completions through the local backend proxy.
 * All credentials (Groq Llama 3.3) are securely managed on the backend.
 */

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

/**
 * Upload business document (.csv or .xlsx)
 */
export async function uploadBusinessFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * Generate 6 recommendations via backend proxy (Groq Llama 3.3)
 */
export async function generateAIRecommendations(dataSummary, userAnswers) {
  const { data } = await api.post('/recommendations', {
    data_summary: dataSummary,
    answers: userAnswers,
  })

  const content = data.raw_response
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed.recommendations || []
    }
    throw new Error("Invalid output format from AI")
  } catch (e) {
    console.error("JSON formatting error", e, content)
    throw new Error("Failed to parse recommendations. Ensure correct format on response.")
  }
}

/**
 * Chat with business data context through backend proxy (Groq Llama 3.3)
 */
export async function getChatResponse(message, history, dataSummary) {
  const formattedHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'assistant',
    content: h.content
  }))

  const { data } = await api.post('/chat', {
    message,
    history: formattedHistory,
    data_summary: dataSummary
  })
  return data.reply
}
