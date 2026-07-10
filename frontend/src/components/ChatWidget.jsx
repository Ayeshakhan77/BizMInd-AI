import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { getChatResponse } from '../services/ai'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'BizMind AI analysis engine online. Send your business query.' }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (customText) => {
    const text = customText || input.trim()
    if (!text || isLoading) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsLoading(true)

    try {
      const summary = JSON.parse(localStorage.getItem('data_summary') || '{}')
      const reply = await getChatResponse(text, messages, summary)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error: ' + err.message }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-3xl bg-primary text-white shadow-[0_0_30px_#7C3AED] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer">
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-8 right-8 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[600px] bg-[#121225] border border-white/10 rounded-[32px] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_#7C3AED]"><Bot className="w-5 h-5 text-white" /></div>
                <div>
                   <h3 className="font-bold text-white text-sm">BizMind Engine</h3>
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success animate-pulse" /><span className="text-[10px] uppercase font-black text-success tracking-widest">Active Analyser</span></div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white/5 text-text-secondary rounded-bl-none border border-white/5'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-6 py-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-2">
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="flex gap-2 bg-[#090915] border border-white/5 rounded-2xl p-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Query data metrics..."
                  className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:outline-none"
                />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
