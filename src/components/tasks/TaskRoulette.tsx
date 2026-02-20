import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore, useIncompleteTasks } from '../../stores/taskStore'
import { useSettingsStore, getPointsForDuration } from '../../stores/settingsStore'
import { useTimerBarStore } from '../../stores/timerBarStore'
import { useT } from '../../utils/i18n'
import { useLangStore, localizedCompletionMessages, getRandomItem } from '../../utils/i18n'
import confetti from 'canvas-confetti'
import { playComplete } from '../../utils/sounds'

const COLORS = [
  '#14b8a6', '#06b6d4', '#f59e0b', '#22c55e', '#3b82f6',
  '#0ea5e9', '#2dd4bf', '#facc15', '#4ade80', '#60a5fa',
]

export default function TaskRoulette() {
  const tasks = useIncompleteTasks()
  const toggleTask = useTaskStore((s) => s.toggleTask)
  const addPoints = useSettingsStore((s) => s.addPoints)
  const updateStreak = useSettingsStore((s) => s.updateStreak)
  const startTask = useTimerBarStore((s) => s.startTask)
  const lang = useLangStore((s) => s.lang)
  const t = useT()
  const [spinning, setSpinning] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [doneMessage, setDoneMessage] = useState('')

  const sliceAngle = tasks.length > 0 ? 360 / tasks.length : 360

  const wheelSlices = useMemo(() => {
    if (tasks.length === 0) return []
    return tasks.map((task, i) => {
      const startAngle = i * sliceAngle
      const endAngle = (i + 1) * sliceAngle
      const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180)
      const color = COLORS[i % COLORS.length]
      const r = 140
      const cx = 150, cy = 150
      const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180)
      const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180)
      const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180)
      const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180)
      const largeArc = sliceAngle > 180 ? 1 : 0
      const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
      const textR = r * 0.6
      const textX = cx + textR * Math.cos(midAngle - Math.PI / 2)
      const textY = cy + textR * Math.sin(midAngle - Math.PI / 2)
      const textRotation = (startAngle + endAngle) / 2
      return { task, color, path, textX, textY, textRotation }
    })
  }, [tasks, sliceAngle])

  const spin = () => {
    if (spinning || tasks.length === 0) return
    setSpinning(true)
    setSelectedId(null)
    setDoneMessage('')
    const spins = 5 + Math.random() * 5
    const extraDeg = Math.random() * 360
    const totalDeg = spins * 360 + extraDeg
    const newRotation = rotation + totalDeg
    setRotation(newRotation)
    const finalAngle = (360 - (newRotation % 360)) % 360
    const idx = Math.floor(finalAngle / sliceAngle) % tasks.length
    setTimeout(() => {
      setSpinning(false)
      setSelectedId(tasks[idx].id)
      playComplete()
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 }, colors: ['#2dd4bf', '#facc15', '#4ade80', '#67e8f9'] })
    }, 3000)
  }

  const handlePlay = () => {
    const task = tasks.find((t) => t.id === selectedId)
    if (task) startTask(task)
  }

  const handleComplete = () => {
    if (!selectedId) return
    const task = tasks.find((t) => t.id === selectedId)
    if (task) {
      toggleTask(selectedId)
      addPoints(getPointsForDuration(task.duration))
      updateStreak()
      playComplete()
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#2dd4bf', '#5eead4', '#facc15', '#4ade80', '#67e8f9'] })
      setDoneMessage(getRandomItem(localizedCompletionMessages[lang]))
      setTimeout(() => setDoneMessage(''), 2500)
    }
    setSelectedId(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="text-4xl mb-2">🎰</p>
        <p className="text-[13px] font-medium">{t('roulette.no_tasks')}</p>
      </div>
    )
  }

  const selectedTask = tasks.find((t) => t.id === selectedId)

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-[260px] h-[260px]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-primary-300 drop-shadow-lg" />
        </div>
        <motion.svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl" animate={{ rotate: rotation }} transition={{ duration: 3, ease: [0.17, 0.67, 0.12, 0.99] }}>
          {wheelSlices.map(({ task, color, path, textX, textY, textRotation }) => (
            <g key={task.id}>
              <path d={path} fill={color} stroke="rgba(11,17,33,0.5)" strokeWidth="2" />
              <text x={textX} y={textY} fill="white" fontSize="10" fontWeight="600" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${textRotation}, ${textX}, ${textY})`}>
                {task.title.length > 12 ? task.title.slice(0, 12) + '...' : task.title}
              </text>
            </g>
          ))}
          <circle cx="150" cy="150" r="20" fill="#0b1121" stroke="#14b8a6" strokeWidth="3" />
          <text x="150" y="150" fill="white" fontSize="16" textAnchor="middle" dominantBaseline="middle">🎯</text>
        </motion.svg>
      </div>

      <motion.button whileTap={{ scale: 0.95 }} onClick={spin} disabled={spinning}
        className="px-8 py-3 gradient-primary text-white font-bold rounded-2xl text-[15px] shadow-glow-purple disabled:opacity-50 cursor-pointer">
        {spinning ? t('roulette.spinning') : t('roulette.spin')}
      </motion.button>

      <AnimatePresence>
        {doneMessage && !selectedTask && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="w-full glass-card p-4 text-center">
            <p className="text-[14px] font-semibold text-primary-300">{doneMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="w-full glass-card p-4 shadow-glow-purple">
            <p className="text-[11px] text-primary-300 mb-1 font-medium text-center">{t('roulette.your_next')}</p>
            <p className="text-base font-bold text-white text-center">{selectedTask.title}</p>
            <p className="text-[13px] text-primary-400 mt-0.5 text-center font-semibold">{selectedTask.duration} {t('dash.minutes')}</p>

            <div className="flex gap-2 mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white font-semibold text-[13px] shadow-glow-purple cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {t('timer.start_focus')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-success-400 font-semibold text-[13px] hover:bg-success-500/10 transition cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t('timer.done')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
