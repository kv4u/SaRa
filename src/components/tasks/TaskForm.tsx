import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '../../stores/taskStore'
import { useT } from '../../utils/i18n'

interface Props {
  onAdded?: () => void
  parentId?: string
}

export default function TaskForm({ onAdded, parentId }: Props) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<5 | 10 | 15>(10)
  const [isOpen, setIsOpen] = useState(false)
  const addTask = useTaskStore((s) => s.addTask)
  const t = useT()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title.trim(), duration, parentId)
    setTitle('')
    setDuration(10)
    setIsOpen(false)
    onAdded?.()
  }

  return (
    <div>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-full py-3 glass-card text-primary-400 font-semibold text-[13px] cursor-pointer hover:bg-white/[0.07] transition-colors text-center">
            {parentId ? t('tasks.add_subtask') : t('tasks.add_task')}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.form
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onSubmit={handleSubmit}
              className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl p-5 space-y-3 max-w-lg mx-auto"
              style={{ paddingBottom: 'calc(20px + var(--safe-area-bottom))' }}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-1" />

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('tasks.what_to_do')}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[14px] placeholder-gray-500 outline-none focus:border-primary-500/50 focus:bg-white/[0.07] transition-all"
              />

              {/* Duration pills */}
              <div className="flex gap-2">
                {([5, 10, 15] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                      duration === d
                        ? 'gradient-primary text-white shadow-glow-purple'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}>
                    {d} min
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5 pt-0.5">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 rounded-xl text-gray-400 bg-white/5 border border-white/5 hover:bg-white/10 transition font-semibold cursor-pointer text-[13px]">
                  {t('tasks.cancel')}
                </button>
                <button type="submit" disabled={!title.trim()}
                  className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold transition disabled:opacity-30 cursor-pointer text-[13px] shadow-glow-purple">
                  {t('tasks.add')}
                </button>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
