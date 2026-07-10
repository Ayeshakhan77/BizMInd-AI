import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KPICard({ title, value, change, icon: Icon, index = 0 }) {
  const isPositive = change > 0
  const isNeutral = change === 0
  const TrendIcon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-[#121225] border border-white/5 rounded-[24px] p-6 hover:border-primary/40 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
          {Icon && <Icon className="w-6 h-6 text-primary-light" />}
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
          isPositive ? 'bg-success/10 text-success' :
          isNeutral ? 'bg-white/5 text-text-secondary' :
          'bg-danger/10 text-danger'
        } border border-current opacity-70`}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
      
      <div className="mt-8 relative z-10">
        <p className="text-3xl font-black text-white tracking-tighter mb-1">{value}</p>
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title}</p>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  )
}
