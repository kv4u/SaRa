import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimerBarStore } from '../../stores/timerBarStore'
import { useTaskStore } from '../../stores/taskStore'
import { useSettingsStore, getPointsForDuration } from '../../stores/settingsStore'
import { playComplete } from '../../utils/sounds'
import confetti from 'canvas-confetti'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function FloatingTimerBar() {
  const taskId = useTimerBarStore((s) => s.taskId)
  const taskTitle = useTimerBarStore((s) => s.taskTitle)
  const totalSeconds = useTimerBarStore((s) => s.totalSeconds)
  const secondsLeft = useTimerBarStore((s) => s.secondsLeft)
  const isRunning = useTimerBarStore((s) => s.isRunning)
  const tick = useTimerBarStore((s) => s.tick)
  const pause = useTimerBarStore((s) => s.pause)
  const resume = useTimerBarStore((s) => s.resume)
  const stop = useTimerBarStore((s) => s.stop)

  const toggleTask = useTaskStore((s) => s.toggleTask)
  const tasks = useTaskStore((s) => s.tasks)
  const addPoints = useSettingsStore((s) => s.addPoints)
  const updateStreak = useSettingsStore((s) => s.updateStreak)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick])

  useEffect(() => {
    if (taskId && secondsLeft <= 0 && totalSeconds > 0) {
      const task = tasks.find((t) => t.id === taskId)
      if (task && !task.completed) {
        toggleTask(taskId)
        addPoints(getPointsForDuration(task.duration))
        updateStreak()
        playComplete()
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#2dd4bf', '#5eead4', '#facc15', '#4ade80', '#67e8f9'] })
      }
      stop()
    }
  }, [secondsLeft, taskId, totalSeconds, tasks, toggleTask, addPoints, updateStreak, stop])

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0

  return (
    <AnimatePresence>
      {taskId && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-28px)] max-w-md"
        >
          <div className="glass-strong rounded-2xl overflow-hidden shadow-glow-purple">
            <div className="h-[3px] bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white font-semibold truncate">{taskTitle}</p>
              </div>

              <span className="text-[15px] font-bold text-primary-300 tabular-nums tracking-wide">
                {formatTime(secondsLeft)}
              </span>

              <button
                onClick={isRunning ? pause : resume}
                className="p-1.5 rounded-lg text-primary-300 hover:bg-primary-500/15 transition cursor-pointer"
              >
                {isRunning ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                )}
              </button>

              <button
                onClick={stop}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
