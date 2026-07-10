import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
  },
})

// Upload file
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// Analyze data
export const analyzeData = async (sessionId) => {
  const { data } = await api.post('/analyze', { session_id: sessionId })
  return data
}

// Get smart questions
export const getQuestions = async (sessionId) => {
  const { data } = await api.post('/questions', { session_id: sessionId })
  return data
}

// Get AI recommendations
export const getRecommendations = async (sessionId, answers) => {
  const { data } = await api.post('/recommendations', {
    session_id: sessionId,
    answers,
  })
  return data
}

// Chat with AI
export const sendChatMessage = async (sessionId, message, history = []) => {
  const { data } = await api.post('/chat', {
    session_id: sessionId,
    message,
    history,
  })
  return data
}

// Get dashboard data
export const getDashboard = async (sessionId) => {
  const { data } = await api.get(`/dashboard/${sessionId}`)
  return data
}

export default api
