import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { useT, useLangStore, localizedLevelTitles } from '../../utils/i18n'

const levelPoints = [0, 50, 150, 300, 500, 800, 1200, 2000]

const levelGradients = [
  'from-emerald-600 to-teal-500',
  'from-teal-500 to-cyan-500',
  'from-cyan-500 to-sky-400',
  'from-sky-500 to-blue-400',
  'from-orange-500 to-amber-400',
  'from-amber-500 to-yellow-400',
  'from-teal-500 to-emerald-400',
  'from-cyan-500 to-teal-400',
]

export default function LevelBadge() {
  const totalPoints = useSettingsStore((s) => s.totalPoints)
  const lang = useLangStore((s) => s.lang)
  const t = useT()
  const titles = localizedLevelTitles[lang]

  let currentIdx = 0
  for (let i = levelPoints.length - 1; i >= 0; i--) {
    if (totalPoints >= levelPoints[i]) { currentIdx = i; break }
  }
  const nextIdx = currentIdx + 1 < levelPoints.length ? currentIdx + 1 : null
  const progressToNext = nextIdx !== null
    ? (totalPoints - levelPoints[currentIdx]) / (levelPoints[nextIdx] - levelPoints[currentIdx])
    : 1

  const gradient = levelGradients[currentIdx] || levelGradients[0]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[14px] font-bold text-white">{titles[currentIdx]}</span>
          <span className="text-[13px] text-white/80 font-bold">{totalPoints} {t('level.pts')}</span>
        </div>

        {nextIdx !== null ? (
          <>
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full shimmer-bar rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[11px] text-white/50 mt-1.5 font-medium">
              {t('level.pts_to', levelPoints[nextIdx] - totalPoints, titles[nextIdx])}
            </p>
          </>
        ) : (
          <p className="text-[13px] text-white/80 font-medium">{t('level.max')}</p>
        )}
      </div>
    </motion.div>
  )
}
