import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { playTimerEnd } from '../../utils/sounds'
import { useT } from '../../utils/i18n'
import confetti from 'canvas-confetti'

type TimerPhase = 'idle' | 'focus' | 'break' | 'done'

interface Props {
  initialMinutes?: number
  onComplete?: () => void
  isJustFiveMinutes?: boolean
}

const phaseColors: Record<TimerPhase, string> = {
  idle: '#14b8a6',
  focus: '#14b8a6',
  break: '#22c55e',
  done: '#facc15',
}

export default function FocusTimer({ initialMinutes, onComplete, isJustFiveMinutes }: Props) {
  const focusDuration = useSettingsStore((s) => s.focusDuration)
  const breakDuration = useSettingsStore((s) => s.breakDuration)
  const recordFocusMinutes = useSettingsStore((s) => s.recordFocusMinutes)
  const t = useT()

  const targetMinutes = initialMinutes ?? focusDuration
  const [phase, setPhase] = useState<TimerPhase>('idle')
  const [secondsLeft, setSecondsLeft] = useState(targetMinutes * 60)
  const [totalSeconds, setTotalSeconds] = useState(targetMinutes * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  const startFocus = useCallback((minutes?: number) => {
    const mins = minutes ?? targetMinutes
    clearTimer()
    setTotalSeconds(mins * 60)
    setSecondsLeft(mins * 60)
    setPhase('focus')
  }, [targetMinutes, clearTimer])

  const startBreak = useCallback(() => {
    clearTimer()
    setTotalSeconds(breakDuration * 60)
    setSecondsLeft(breakDuration * 60)
    setPhase('break')
  }, [breakDuration, clearTimer])

  const stop = useCallback(() => {
    clearTimer()
    const elapsed = totalSeconds - secondsLeft
    if (phase === 'focus' && elapsed > 30) recordFocusMinutes(Math.round(elapsed / 60))
    setPhase('idle')
    setSecondsLeft(targetMinutes * 60)
    setTotalSeconds(targetMinutes * 60)
  }, [clearTimer, totalSeconds, secondsLeft, phase, recordFocusMinutes, targetMinutes])

  useEffect(() => {
    if (phase === 'focus' || phase === 'break') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            if (phase === 'focus') {
              playTimerEnd()
              recordFocusMinutes(Math.round(totalSeconds / 60))
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#2dd4bf', '#5eead4', '#facc15', '#4ade80'] })
              if (isJustFiveMinutes) setPhase('done'); else startBreak()
              onComplete?.()
            } else { playTimerEnd(); setPhase('done') }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return clearTimer
  }, [phase, clearTimer, totalSeconds, recordFocusMinutes, startBreak, onComplete, isJustFiveMinutes])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const color = phaseColors[phase]
  const size = 220
  const strokeWidth = 8
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${phase === 'focus' ? 'animate-pulse-glow rounded-full' : ''}`} style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(20,184,166,0.06)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.3, ease: 'linear' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {phase === 'idle' ? (
            <>
              <span className="text-5xl font-extrabold text-white tracking-tight">{targetMinutes}</span>
              <span className="text-[13px] text-gray-500 mt-1">{t('timer.minutes')}</span>
            </>
          ) : (
            <span className="text-5xl font-extrabold text-white tracking-tight font-mono">{timeStr}</span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
          className="mt-4 text-[13px] font-semibold" style={{ color }}>
          {phase === 'idle' && t('timer.ready')}
          {phase === 'focus' && t('timer.focus_time')}
          {phase === 'break' && t('timer.break_time')}
          {phase === 'done' && t('timer.session_complete')}
        </motion.p>
      </AnimatePresence>

      <div className="flex gap-3 mt-6">
        {phase === 'idle' && (
          <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} whileTap={{ scale: 0.95 }} onClick={() => startFocus()}
            className="px-8 py-3 gradient-primary text-white font-semibold rounded-2xl shadow-glow-purple cursor-pointer text-[15px]">
            {t('timer.start_focus')}
          </motion.button>
        )}
        {(phase === 'focus' || phase === 'break') && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={stop}
            className="px-8 py-3 glass-card text-gray-300 font-semibold rounded-2xl cursor-pointer text-[15px] hover:bg-white/[0.07] transition">
            {t('timer.stop')}
          </motion.button>
        )}
        {phase === 'done' && isJustFiveMinutes && (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => startFocus(5)}
              className="px-6 py-3 gradient-primary text-white font-semibold rounded-2xl shadow-glow-purple cursor-pointer text-[13px]">
              {t('timer.keep_going')}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setPhase('idle'); setSecondsLeft(targetMinutes * 60) }}
              className="px-6 py-3 glass-card text-gray-300 font-semibold rounded-2xl cursor-pointer text-[13px] hover:bg-white/[0.07] transition">
              {t('timer.done')}
            </motion.button>
          </>
        )}
        {phase === 'done' && !isJustFiveMinutes && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => startFocus()}
            className="px-8 py-3 gradient-primary text-white font-semibold rounded-2xl shadow-glow-purple cursor-pointer text-[15px]">
            {t('timer.another_round')}
          </motion.button>
        )}
      </div>
    </div>
  )
}
