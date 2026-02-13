import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import StreakCalendar from '../components/progress/StreakCalendar'
import WeeklyChart from '../components/progress/WeeklyChart'
import ProgressRing from '../components/progress/ProgressRing'
import LevelBadge from '../components/rewards/LevelBadge'
import { useTodayCompleted } from '../stores/taskStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useT } from '../utils/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export default function Progress() {
  const todayCompleted = useTodayCompleted()
  const totalPoints = useSettingsStore((s) => s.totalPoints)
  const totalFocusMinutesToday = useSettingsStore((s) => s.totalFocusMinutesToday)
  const lastFocusDate = useSettingsStore((s) => s.lastFocusDate)
  const t = useT()

  const today = new Date().toISOString().split('T')[0]
  const focusToday = lastFocusDate === today ? totalFocusMinutesToday : 0

  return (
    <PageWrapper title={t('progress.title')}>
      <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
        {/* Stats rings */}
        <motion.div variants={fadeUp} className="glass-card py-4 px-3">
          <div className="flex justify-around">
            <ProgressRing value={todayCompleted.length} max={5} label={t('progress.tasks')} sublabel={t('dash.today')} size={72} />
            <ProgressRing value={focusToday} max={120} label={t('dash.minutes')} sublabel={t('progress.focused')} color="#22c55e" size={72} />
            <ProgressRing value={totalPoints} max={totalPoints + 100} label={t('progress.points')} sublabel={t('progress.total')} color="#facc15" size={72} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}><LevelBadge /></motion.div>
        <motion.div variants={fadeUp}><StreakCalendar /></motion.div>
        <motion.div variants={fadeUp}><WeeklyChart /></motion.div>
      </motion.div>
    </PageWrapper>
  )
}
