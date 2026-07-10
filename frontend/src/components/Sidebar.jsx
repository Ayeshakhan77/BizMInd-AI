import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Upload,
  HelpCircle,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart,
  Zap,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/', icon: Upload, label: 'Data Lab' },
  { path: '/questions', icon: HelpCircle, label: 'AI Strategy' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <motion.aside
        animate={{ width: isOpen ? 260 : 80 }}
        className="h-full bg-[#0D0D1A] border-r border-white/5 flex flex-col z-50 transition-all duration-300 relative"
      >
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl tracking-tight text-white">
              BizMind
            </motion.span>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'text-white' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary rounded-xl" 
                  />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 z-10 ${isActive ? 'text-primary-light' : 'group-hover:text-primary-light'}`} />
                {isOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium z-10 whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
                {isActive && isOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#7C3AED] z-10" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer info/Go Pro */}
        {isOpen && (
          <div className="p-4 mx-4 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary-light" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Pro Plan</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-normal mb-3">
              Unlock advanced AI predictions and deep metrics.
            </p>
            <button className="w-full py-2 bg-primary hover:bg-primary-dark rounded-lg text-xs font-bold text-white transition-colors cursor-pointer">
              Go Pro
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="p-4 flex justify-center text-text-muted hover:text-white transition-colors border-t border-white/5"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </motion.aside>
    </>
  )
}
