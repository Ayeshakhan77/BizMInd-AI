import { useContext } from 'react'
import { AppContext } from '../App'
import { Menu, Bell, User, Sparkles } from 'lucide-react'

export default function Header({ onMenuToggle }) {
  const { fileName } = useContext(AppContext)

  return (
    <header className="h-16 border-b border-border bg-bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors cursor-pointer"
          id="menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-light" />
          <span className="text-sm text-text-secondary">
            {fileName ? (
              <>Working with <span className="text-primary-light font-medium">{fileName}</span></>
            ) : (
              'Upload data to get started'
            )}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors cursor-pointer"
          id="notifications-btn"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-[10px] text-text-muted">Free Plan</p>
          </div>
        </div>
      </div>
    </header>
  )
}
