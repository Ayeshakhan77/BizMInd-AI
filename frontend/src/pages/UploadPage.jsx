import { useState, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileSpreadsheet, X, ArrowRight,
  Table, BarChart3, Calendar, Layers, Sparkles,
  AlertCircle, CheckCircle
} from 'lucide-react'
import { AppContext } from '../App'
import { uploadBusinessFile } from '../services/ai'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UploadPage() {
  const navigate = useNavigate()
  const { setSessionId, setFileName } = useContext(AppContext)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [stats, setStats] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const processFile = useCallback(async (f) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setError('Please upload a CSV or Excel (.xlsx) file.')
      return
    }
    
    setError('')
    setFile(f)
    setFileName(f.name)
    setIsProcessing(true)

    try {
      const results = await uploadBusinessFile(f)
      
      const summarySummary = {
        totalRows: results.total_rows,
        columns: results.columns,
        numericFields: results.numeric_fields,
        sums: results.sums,
        averages: results.averages
      }

      // Store in localStorage for dashboard and chatbot context
      localStorage.setItem('data_summary', JSON.stringify(summarySummary))
      localStorage.setItem('raw_data', JSON.stringify(results.all_rows))
      
      setPreview(results.preview)
      setStats(summarySummary)
      setSessionId('local-session-' + Date.now())
    } catch (err) {
      setError(err.response?.data?.detail || 'Error parsing file: Make sure backend server is running.')
      setFile(null)
    } finally {
      setIsProcessing(false)
    }
  }, [setFileName, setSessionId])

  const handleFileSelect = (e) => {
    const f = e.target.files[0]
    if (f) processFile(f)
  }

  const handleAnalyze = () => {
    navigate('/questions')
  }

  const resetUpload = () => {
    setFile(null)
    setPreview([])
    setStats(null)
    setError('')
    localStorage.removeItem('data_summary')
    localStorage.removeItem('raw_data')
  }

  return (
    <div className="max-w-5xl mx-auto container-padded">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Data <span className="text-primary-light">Intelligence</span> Hub
        </h1>
        <p className="text-text-secondary">Upload your CSV or Excel document to generate real-time AI metrics and growth strategies.</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-center gap-3 text-danger text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {!stats ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]) }}
            className={`
              block w-full p-16 rounded-[40px] border-2 border-dashed transition-all duration-500 text-center cursor-pointer
              ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/10 hover:border-primary/40 hover:bg-white/[0.02]'}
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
            {isProcessing ? (
              <LoadingSpinner text="Parsing document structure on backend..." />
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center text-primary-light shadow-[0_0_30px_rgba(124,58,237,0.15)]">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="text-2xl font-bold text-white mb-2">Drop Business Data</p>
                <p className="text-text-secondary mb-4">Accepts both CSV and Excel (.xlsx, .xls) files.</p>
              </>
            )}
          </label>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="bg-[#121225] border border-white/5 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{file?.name}</p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Processing Complete</p>
                </div>
              </div>
              <button onClick={resetUpload} className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-text-secondary"><X /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Layers, label: 'Total Records', val: stats.totalRows },
                { icon: Table, label: 'Columns Found', val: stats.columns.length },
                { icon: BarChart3, label: 'Numeric Metrics', val: stats.numericFields.length }
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <s.icon className="w-5 h-5 text-primary-light mb-3" />
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-xs font-bold text-text-secondary uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#121225] border border-white/5 rounded-[32px] p-8 overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-primary-light" /> Preview Engine
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-text-muted border-b border-white/5 uppercase font-black tracking-tighter">
                    {stats.columns.map(c => <th key={c} className="pb-4 px-4">{c}</th>)}
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {stats.columns.map(c => <td key={c} className="py-4 px-4">{row[c] !== null ? String(row[c]) : ""}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full py-5 rounded-[24px] bg-white text-black font-black text-lg uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-6 h-6" /> Generate AI Insights
          </button>
        </motion.div>
      )}
    </div>
  )
}
