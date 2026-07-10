import { useState, createContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatWidget from './components/ChatWidget'
import UploadPage from './pages/UploadPage'
import QuestionsPage from './pages/QuestionsPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'

// Global app context
export const AppContext = createContext()

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [fileName, setFileName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const contextValue = {
    sessionId, setSessionId,
    analysisData, setAnalysisData,
    dashboardData, setDashboardData,
    recommendations, setRecommendations,
    fileName, setFileName,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex h-screen bg-bg-dark overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </AppContext.Provider>
  )
}

export default App
