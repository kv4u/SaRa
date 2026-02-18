import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import { useTaskStore } from '../stores/taskStore'
import { useT } from '../utils/i18n'
import { sendMessage, type ChatMessage, type AiTaskSuggestion } from '../utils/ai'
import { storage } from '../utils/storage'

interface StoredMessage {
  role: 'user' | 'model'
  text: string
  tasks?: AiTaskSuggestion[]
  addedTitles?: string[]
}

export default function SmartPlanner() {
  const addTask = useTaskStore((s) => s.addTask)
  const t = useT()

  const [messages, setMessages] = useState<StoredMessage[]>(() =>
    storage.get<StoredMessage[]>('aiChatMessages', [])
  )
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    storage.set('aiChatMessages', messages)
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: StoredMessage = { role: 'user', text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const chatHistory: ChatMessage[] = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }))

      const response = await sendMessage(chatHistory)
      const aiMsg: StoredMessage = {
        role: 'model',
        text: response.text,
        tasks: response.tasks.length > 0 ? response.tasks : undefined,
        addedTitles: [],
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errMsg: StoredMessage = {
        role: 'model',
        text: t('smart.error'),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = (msgIdx: number, task: AiTaskSuggestion) => {
    addTask(task.title, task.duration)
    setMessages((prev) =>
      prev.map((m, i) => {
        if (i !== msgIdx) return m
        return { ...m, addedTitles: [...(m.addedTitles || []), task.title] }
      })
    )
  }

  const clearChat = () => {
    setMessages([])
    storage.set('aiChatMessages', [])
  }

  return (
    <PageWrapper title={t('smart.title')}>
      <div className="flex flex-col" style={{ height: 'calc(100dvh - 190px)' }}>
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2 mb-2 shrink-0">
          <button
            onClick={clearChat}
            className="text-[11px] text-gray-500 hover:text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            {t('smart.clear')}
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2 min-h-0">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 text-[13px] text-gray-300 leading-relaxed flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm">🧠</span>
              </div>
              <p>{t('smart.welcome')}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                    <span className="text-xs">🧠</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-primary text-white rounded-br-sm'
                      : 'glass-card text-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.tasks && msg.tasks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.tasks.map((task, tIdx) => {
                        const added = (msg.addedTitles || []).includes(task.title)
                        return (
                          <div key={tIdx} className="bg-black/20 rounded-xl p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[12px] font-semibold text-white leading-snug">
                                {task.title}
                              </p>
                              <button
                                onClick={() => !added && handleAddTask(idx, task)}
                                disabled={added}
                                className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                                  added
                                    ? 'bg-success-500/20 text-success-400'
                                    : 'gradient-primary text-white shadow-glow-purple'
                                }`}
                              >
                                {added ? '✓ ' + t('smart.added') : '+ ' + t('smart.add_task')}
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-medium">
                                {task.duration}m
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-500/20 text-red-300'
                                  : task.priority === 'medium'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-gray-500/20 text-gray-300'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">
                                {task.deadline.replace(/_/g, ' ')}
                              </span>
                              {task.category && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-medium">
                                  {task.category}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-start">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                <span className="text-xs">🧠</span>
              </div>
              <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] text-gray-400">{t('smart.thinking')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="pt-3 shrink-0">
          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={t('smart.input_placeholder')}
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] placeholder-gray-500 outline-none focus:border-primary-500/50 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl gradient-primary text-white disabled:opacity-30 cursor-pointer shadow-glow-purple shrink-0 flex items-center justify-center transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
