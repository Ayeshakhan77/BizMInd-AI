import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingCart, TrendingUp, Star, LayoutDashboard, Sparkles, Search } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AppContext } from '../App'
import KPICard from '../components/KPICard'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { recommendations, setRecommendations } = useContext(AppContext)
  const [chartData, setChartData] = useState([])
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('raw_data')
    const summ = localStorage.getItem('data_summary')
    const savedRecs = localStorage.getItem('ai_recommendations')

    if (!summ) {
      navigate('/')
      return
    }

    const parsedSummary = JSON.parse(summ)
    const parsedData = JSON.parse(raw || '[]')
    
    setSummary(parsedSummary)
    
    // Find numeric column for chart
    const salesCol = parsedSummary.numericFields.find(f => f.toLowerCase().includes('sale') || f.toLowerCase().includes('revenue')) || parsedSummary.numericFields[0]
    
    const formatted = parsedData.map((row, i) => ({
      name: i + 1,
      sales: row[salesCol] || 0
    }))
    
    setChartData(formatted)
    if (savedRecs) setRecommendations(JSON.parse(savedRecs))
    
    setIsLoading(false)
  }, [navigate, setRecommendations])

  if (isLoading) return <LoadingSpinner text="Rendering Strategic Metric Engine..." />

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-1000 container-padded">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Revenue <span className="text-primary-light">Intelligence</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium tracking-wide uppercase">Operational Intelligence Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary shadow-[0_0_20px_#7C3AED] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer">
            AI Active
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Gross Volume" value={`$${(summary.sums[summary.numericFields[0]] || 0).toLocaleString()}`} change={12} icon={DollarSign} index={0} />
        <KPICard title="Metric Avg" value={`$${(summary.averages[summary.numericFields[0]] || 0).toLocaleString()}`} change={5} icon={TrendingUp} index={1} />
        <KPICard title="Data Points" value={summary.totalRows.toLocaleString()} change={0} icon={ShoppingCart} index={2} />
        <KPICard title="Numeric Channels" value={summary.numericFields.length} change={0} icon={Star} index={3} />
      </div>

      <div className="bg-[#121225] rounded-[40px] p-10 border border-white/5 shadow-2xl overflow-hidden relative group">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-white mb-1">Strategic Performance Index</h3>
            <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Real-time Browser Data Ingestion</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 11, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 11, fontWeight: 'bold'}} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090915', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#A855F7', fontWeight: '900' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#A855F7" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="pt-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary-light" />
            <h2 className="text-3xl font-black text-white">AI Strategies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} {...rec} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
