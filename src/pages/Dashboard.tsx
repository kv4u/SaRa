import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import LevelBadge from '../components/rewards/LevelBadge'
import JustFiveMinutes from '../components/timer/JustFiveMinutes'
import TaskRoulette from '../components/tasks/TaskRoulette'
import ProgressRing from '../components/progress/ProgressRing'
import LanguageToggle from '../components/common/LanguageToggle'
import { useTaskStore, useIncompleteTasks, useTodayCompleted } from '../stores/taskStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useT, useLangStore, localizedAffirmations, getLocalizedGreeting, getRandomItem } from '../utils/i18n'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const t = useT()
  const lang = useLangStore((s) => s.lang)
  const tasks = useTaskStore((s) => s.tasks)
  const todayCompleted = useTodayCompleted()
  const incompleteTasks = useIncompleteTasks()
  const streakDays = useSettingsStore((s) => s.streakDays)
  const totalFocusMinutesToday = useSettingsStore((s) => s.totalFocusMinutesToday)
  const lastFocusDate = useSettingsStore((s) => s.lastFocusDate)

  const [greeting, setGreeting] = useState(getLocalizedGreeting(lang))
  const [affirmation, setAffirmation] = useState(getRandomItem(localizedAffirmations[lang]))
  const [showRoulette, setShowRoulette] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const focusToday = lastFocusDate === today ? totalFocusMinutesToday : 0

  useEffect(() => {
    setGreeting(getLocalizedGreeting(lang))
    setAffirmation(getRandomItem(localizedAffirmations[lang]))
  }, [lang])

  useEffect(() => {
    const interval = setInterval(() => {
      setAffirmation(getRandomItem(localizedAffirmations[lang]))
    }, 30000)
    return () => clearInterval(interval)
  }, [lang])

  const hasTasks = tasks.length > 0
  const doneToday = todayCompleted.length > 0

  return (
    <PageWrapper>
      <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">

        {/* Hero greeting */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl p-4 gradient-primary shadow-glow-purple">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-0.5">
              <h1 className="text-xl font-extrabold text-white leading-tight pr-3">{greeting}</h1>
              <LanguageToggle />
            </div>
            <motion.p
              key={affirmation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[13px] text-white/60 mt-1.5 leading-relaxed"
            >
              {affirmation}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats row — compact rings */}
        <motion.div variants={fadeUp} className="flex justify-around">
          <ProgressRing value={todayCompleted.length} max={Math.max(incompleteTasks.length + todayCompleted.length, 5)} label={t('dash.done')} sublabel={t('dash.today')} />
          <ProgressRing value={focusToday} max={60} label={t('dash.focus')} sublabel={t('dash.minutes')} color="#22c55e" />
          <ProgressRing value={streakDays} max={Math.max(streakDays, 7)} label={t('dash.streak')} sublabel={t('dash.days')} color="#facc15" />
        </motion.div>

        {/* Level */}
        <motion.div variants={fadeUp}>
          <LevelBadge />
        </motion.div>

        {/* Nudge */}
        {!doneToday && (
          <motion.div variants={fadeUp} className="glass-card p-3.5 text-center">
            <p className="text-[13px] text-primary-200 leading-relaxed">
              {hasTasks ? t('dash.nudge_start') : t('dash.nudge_no_tasks')}
            </p>
          </motion.div>
        )}
        {doneToday && (
          <motion.div variants={fadeUp} className="glass-card p-3.5 text-center" style={{ borderColor: 'rgba(34,197,94,0.12)' }}>
            <p className="text-[13px] text-success-400 leading-relaxed">
              {t('dash.completed_today', todayCompleted.length)}
            </p>
          </motion.div>
        )}

        {/* Just 5 Minutes */}
        <motion.div variants={fadeUp}>
          <JustFiveMinutes />
        </motion.div>

        {/* Roulette trigger */}
        {incompleteTasks.length >= 2 && (
          <motion.div variants={fadeUp}>
            <button
              onClick={() => setShowRoulette(!showRoulette)}
              className="w-full py-3 glass-card text-center text-white font-semibold text-[13px] cursor-pointer hover:bg-white/[0.07] transition-colors"
            >
              {showRoulette ? t('dash.hide_roulette') : t('dash.show_roulette')}
            </button>
            {showRoulette && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 overflow-hidden">
                <TaskRoulette />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Quick links grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
          <QuickCard onClick={() => navigate('/tasks')} icon="📝" label={t('dash.my_tasks')} sub={t('dash.active', incompleteTasks.length)} />
          <QuickCard onClick={() => navigate('/timer')} icon="⏱️" label={t('dash.focus_timer')} />
          <QuickCard onClick={() => navigate('/dopamine')} icon="⚡" label={t('dash.dopamine_boost')} />
          <QuickCard onClick={() => navigate('/progress')} icon="📊" label={t('dash.progress')} />
        </motion.div>

      </motion.div>
    </PageWrapper>
  )
}

function QuickCard({ onClick, icon, label, sub }: { onClick: () => void; icon: string; label: string; sub?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass-card flex flex-col items-center justify-center py-4 px-3 cursor-pointer hover:bg-white/[0.07] transition-colors"
    >
      <span className="text-2xl mb-1.5">{icon}</span>
      <p className="text-[12px] font-semibold text-white">{label}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </motion.button>
  )
}
