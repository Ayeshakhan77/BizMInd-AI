import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, Globe, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [lang, setLang] = useState(localStorage.getItem('bizmind_lang') || 'english')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('bizmind_lang', lang)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="max-w-3xl mx-auto container-padded space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">System <span className="text-primary-light">Config</span></h1>
        <p className="text-text-secondary mt-2">Manage your UI locale and operational preferences.</p>
      </div>

      {/* AI Key Status Indicator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121225] border border-white/5 rounded-[40px] p-10 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
            <Shield className="w-6 h-6" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-white">AI Infrastructure</h2>
             <p className="text-xs text-text-muted">Automatic backend credentials active</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-4 leading-relaxed font-medium">
          The Groq API (llama-3.3-70b-versatile) integration is securely configured on the server. Your requests are processed and authenticated directly with no extra setup.
        </p>
      </motion.div>

      {/* Language Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#121225] border border-white/5 rounded-[40px] p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-light">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Language Preference</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['English', 'Urdu'].map(l => (
            <button 
              key={l} 
              onClick={() => setLang(l.toLowerCase())} 
              className={`py-4 rounded-2xl font-bold transition-all border-2 cursor-pointer ${
                lang === l.toLowerCase() 
                  ? 'bg-primary/20 border-primary text-white scale-[1.02]' 
                  : 'bg-white/5 border-transparent text-text-muted hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save Action */}
      <button onClick={handleSave} className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[4px] flex items-center justify-center gap-3 transition-all cursor-pointer ${isSaved ? 'bg-success text-white' : 'bg-white text-black hover:scale-[1.01]'} shadow-2xl`}>
        {isSaved ? <><Check className="w-5 h-5" /> Settings Saved</> : <><Save className="w-5 h-5" /> Save Configuration</>}
      </button>
    </div>
  )
}
