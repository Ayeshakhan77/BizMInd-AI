import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = 'Analyzing your data...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-light animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-6 text-text-secondary text-sm animate-pulse">{text}</p>
    </motion.div>
  )
}
