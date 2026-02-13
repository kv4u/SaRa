import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
  label: string
  sublabel: string
  color?: string
  size?: number
}

export default function ProgressRing({ value, max, label, sublabel, color = '#14b8a6', size = 68 }: Props) {
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const r = (size - 10) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(20, 184, 166, 0.06)"
            strokeWidth="6"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 4px ${color}30)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-white leading-none">{value}</span>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-white mt-1">{label}</p>
      <p className="text-[9px] text-gray-500 leading-none">{sublabel}</p>
    </div>
  )
}
