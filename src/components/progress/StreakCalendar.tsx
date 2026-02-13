import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { useT } from '../../utils/i18n'

export default function StreakCalendar() {
  const completedDates = useSettingsStore((s) => s.completedDates)
  const streakDays = useSettingsStore((s) => s.streakDays)
  const t = useT()

  const days = useMemo(() => {
    const result: { date: string; active: boolean; isToday: boolean }[] = []
    const today = new Date()
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      result.push({ date: dateStr, active: completedDates.includes(dateStr), isToday: i === 0 })
    }
    return result
  }, [completedDates])

  const dayLabels = [t('days.M'), t('days.T1'), t('days.W'), t('days.T2'), t('days.F'), t('days.S1'), t('days.S2')]

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-white">{t('progress.activity')}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🔥</span>
          <span className="text-base font-bold text-accent-400">{streakDays}</span>
          <span className="text-[10px] text-gray-500 font-medium">{t('progress.day_streak')}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((label, i) => (
          <div key={i} className="text-[9px] text-gray-500 text-center font-medium">{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <motion.div key={day.date} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.008 }}
            className={`aspect-square rounded transition-colors ${
              day.active
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm shadow-primary-500/20'
                : day.isToday
                  ? 'bg-white/5 ring-1 ring-primary-500/30'
                  : 'bg-white/[0.03]'
            }`} title={day.date} />
        ))}
      </div>

      {streakDays >= 3 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {streakDays >= 3 && <MilestoneBadge label={t('progress.3_days')} emoji="🌱" />}
          {streakDays >= 7 && <MilestoneBadge label={t('progress.1_week')} emoji="⭐" />}
          {streakDays >= 14 && <MilestoneBadge label={t('progress.2_weeks')} emoji="🔥" />}
          {streakDays >= 30 && <MilestoneBadge label={t('progress.30_days')} emoji="👑" />}
        </div>
      )}
    </div>
  )
}

function MilestoneBadge({ label, emoji }: { label: string; emoji: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] glass px-2 py-1 rounded-full text-primary-300 font-medium">
      {emoji} {label}
    </span>
  )
}
