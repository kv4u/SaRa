import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTaskStore, useSubTasks } from '../../stores/taskStore'
import { useSettingsStore, getPointsForDuration } from '../../stores/settingsStore'
import { useTimerBarStore } from '../../stores/timerBarStore'
import { playComplete } from '../../utils/sounds'
import { useLangStore, localizedCompletionMessages, getRandomItem, useT } from '../../utils/i18n'
import type { Task } from '../../stores/taskStore'
import confetti from 'canvas-confetti'
import TaskForm from './TaskForm'

function getAccent(duration: number) {
  if (duration <= 5) return { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  if (duration <= 15) return { border: 'border-l-teal-500', bg: 'bg-teal-500/10', text: 'text-teal-400' }
  return { border: 'border-l-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400' }
}

export default function TaskItem({ task, index }: { task: Task; index: number }) {
  const toggleTask = useTaskStore((s) => s.toggleTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const addPoints = useSettingsStore((s) => s.addPoints)
  const updateStreak = useSettingsStore((s) => s.updateStreak)
  const startTask = useTimerBarStore((s) => s.startTask)
  const activeTaskId = useTimerBarStore((s) => s.taskId)
  const lang = useLangStore((s) => s.lang)
  const t = useT()
  const [showMessage, setShowMessage] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const subTasks = useSubTasks(task.id)
  const accent = getAccent(task.duration)
  const isPlaying = activeTaskId === task.id

  const handleToggle = () => {
    if (!task.completed) {
      playComplete()
      addPoints(getPointsForDuration(task.duration))
      updateStreak()
      setShowMessage(getRandomItem(localizedCompletionMessages[lang]))
      setTimeout(() => setShowMessage(''), 2500)
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#2dd4bf', '#5eead4', '#facc15', '#4ade80', '#67e8f9'] })
    }
    toggleTask(task.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      layout
    >
      <div className={`glass-card border-l-[3px] ${accent.border} p-3.5 transition-all ${task.completed ? 'opacity-40' : ''} ${isPlaying ? 'ring-1 ring-primary-500/40' : ''}`}>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleToggle}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 ${
              task.completed
                ? 'bg-gradient-to-br from-primary-500 to-cyan-500 border-transparent'
                : 'border-primary-500/40 hover:border-primary-400 hover:bg-primary-500/10'
            }`}
          >
            {task.completed && (
              <motion.svg initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            )}
          </motion.button>

          <div className="flex-1 min-w-0" onClick={() => !task.parentId && setExpanded(!expanded)}>
            <p className={`text-[13px] font-medium truncate leading-snug ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.title}
            </p>
            {showMessage && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] text-primary-300 mt-0.5 font-medium">
                {showMessage}
              </motion.p>
            )}
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
            {task.duration}m
          </span>

          {!task.completed && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => startTask(task)}
              className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                isPlaying
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-gray-500 hover:text-primary-400 hover:bg-primary-500/10'
              }`}
              title="Start timer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </motion.button>
          )}

          <motion.button whileTap={{ scale: 0.8 }} onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 transition p-1 cursor-pointer rounded-lg hover:bg-red-500/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        </div>

        {expanded && !task.parentId && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2.5 ml-8 space-y-2 overflow-hidden border-l border-primary-800/30 pl-3">
            {subTasks.map((sub, i) => <TaskItem key={sub.id} task={sub} index={i} />)}
            {showSubForm ? (
              <TaskForm parentId={task.id} onAdded={() => setShowSubForm(false)} />
            ) : (
              <button onClick={() => setShowSubForm(true)} className="text-[11px] text-primary-400 hover:text-primary-300 font-medium transition cursor-pointer py-0.5">
                {t('tasks.add_subtask_link')}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
