import { motion } from 'framer-motion'
import type { DopamineItem } from '../../stores/settingsStore'

interface Props {
  item: DopamineItem
  index: number
  onRemove?: (id: string) => void
  highlighted?: boolean
}

export default function DopamineCard({ item, index, onRemove, highlighted }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, scale: highlighted ? 1.02 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.025, duration: 0.25 }}
      className={`relative flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
        highlighted
          ? 'glass-card shadow-glow-purple ring-1 ring-primary-400/40'
          : 'glass-card'
      }`}
    >
      {highlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-cyan-500/10 pointer-events-none"
        />
      )}
      <span className="text-xl relative z-10">{item.emoji}</span>
      <span className="text-[13px] font-medium text-white flex-1 relative z-10">{item.label}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="relative z-10 text-gray-600 hover:text-red-400 transition p-1 cursor-pointer rounded-lg hover:bg-red-500/10"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}
