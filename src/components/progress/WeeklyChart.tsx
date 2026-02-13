import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTaskStore } from '../../stores/taskStore'
import { useT, useLangStore } from '../../utils/i18n'

export default function WeeklyChart() {
  const tasks = useTaskStore((s) => s.tasks)
  const t = useT()
  const lang = useLangStore((s) => s.lang)

  const weekData = useMemo(() => {
    const days: { label: string; minutes: number; count: number }[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const dayLabel = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en', { weekday: 'short' })
      const dayTasks = tasks.filter((t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === dateStr)
      const minutes = dayTasks.reduce((sum, t) => sum + t.duration, 0)
      days.push({ label: dayLabel, minutes, count: dayTasks.length })
    }
    return days
  }, [tasks, lang])

  const maxMinutes = Math.max(...weekData.map((d) => d.minutes), 1)

  return (
    <div className="glass-card p-4">
      <h3 className="text-[13px] font-bold text-white mb-3">{t('progress.this_week')}</h3>
      <div className="flex items-end justify-between gap-1.5 h-28">
        {weekData.map((day, i) => {
          const height = (day.minutes / maxMinutes) * 100
          const isToday = i === 6
          return (
            <div key={day.label + i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-500 font-medium">{day.minutes}m</span>
              <div className="w-full flex-1 flex items-end">
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(height, 4)}%` }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg ${
                    isToday
                      ? 'bg-gradient-to-t from-primary-600 to-primary-400 shadow-sm shadow-primary-500/20'
                      : 'bg-white/[0.06]'
                  }`} />
              </div>
              <span className={`text-[9px] font-semibold ${isToday ? 'text-primary-300' : 'text-gray-600'}`}>{day.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
