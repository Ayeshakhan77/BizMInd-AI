import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function RecommendationCard({ icon, title, description, category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[#121225] border border-white/5 rounded-[28px] p-8 hover:bg-[#181832] hover:border-primary/30 transition-all duration-500 group group"
    >
      <div className="flex flex-col h-full">
        <div className="mb-6 flex items-center justify-between">
            <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">
                {icon || '💡'}
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase font-black tracking-widest text-text-muted">
                {category || 'Insight'}
            </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-light transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
            {description}
          </p>
        </div>
        
        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-light group-hover:text-white transition-all duration-300 cursor-pointer">
            Execute Strategy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}
