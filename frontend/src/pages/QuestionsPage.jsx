import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react'
import { AppContext } from '../App'
import { generateAIRecommendations } from '../services/ai'
import LoadingSpinner from '../components/LoadingSpinner'

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { setRecommendations } = useContext(AppContext)

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const questions = [
    { id: 'focus_area', question: 'What would you like to analyze?', options: ['Sales Trends', 'Stock Levels', 'Customer Patterns', 'Profit Analysis'] },
    { id: 'time_period', question: 'Which time period interests you most?', options: ['Last Week', 'Last Month', 'Last 3 Months', 'All Time'] },
    { id: 'business_goal', question: 'What is your main business goal?', options: ['Increase Sales', 'Reduce Costs', 'Improve Stock', 'Find Best Products'] },
    { id: 'business_type', question: 'What type of business do you run?', options: ['Retail Store', 'E-commerce', 'Restaurant / Food', 'Wholesale'] }
  ]

  useEffect(() => {
    const summary = localStorage.getItem('data_summary')
    if (!summary) navigate('/')
  }, [navigate])

  const handleSelect = (id, opt) => {
    setAnswers(prev => ({ ...prev, [id]: opt }))
    if (currentQ < questions.length - 1) setTimeout(() => setCurrentQ(q => q + 1), 300)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      const summary = JSON.parse(localStorage.getItem('data_summary'))
      const recs = await generateAIRecommendations(summary, answers)
      setRecommendations(recs)
      localStorage.setItem('ai_recommendations', JSON.stringify(recs))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to generate insights: ' + (err.response?.data?.detail || err.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) return <LoadingSpinner text="Consulting Strategic Groq Engine..." />

  const q = questions[currentQ]
  const progress = (Object.keys(answers).length / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto container-padded">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Strategic <span className="text-primary-light">Context</span></h1>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary" />
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-danger/10 border border-danger/30 rounded-3xl flex items-center gap-4 text-danger font-bold">
          <AlertTriangle /> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-[#121225] border border-white/5 rounded-[40px] p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-light">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">{q.question}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(q.id, opt)}
                className={`p-6 rounded-2xl text-left font-bold transition-all border-2 border-transparent ${answers[q.id] === opt ? 'bg-primary/20 border-primary text-white scale-[1.02]' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={() => setCurrentQ(c => Math.max(0, c - 1))} className="text-text-muted hover:text-white transition-colors p-4"><ArrowLeft /></button>
        {Object.keys(answers).length === questions.length && (
          <button onClick={handleSubmit} className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5" /> Generate Insights
          </button>
        )}
      </div>
    </div>
  )
}
