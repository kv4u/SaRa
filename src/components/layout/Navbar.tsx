import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useT } from '../../utils/i18n'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const t = useT()

  const tabs = [
    { path: '/', label: t('nav.home'), icon: HomeIcon },
    { path: '/tasks', label: t('nav.tasks'), icon: TasksIcon },
    { path: '/timer', label: t('nav.timer'), icon: TimerIcon },
    { path: '/smart', label: t('nav.smart'), icon: SmartIcon },
    { path: '/progress', label: t('nav.progress'), icon: ProgressIcon },
  ]

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-28px)] max-w-md"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      <div className="glass-strong flex items-center justify-around rounded-2xl h-14 px-2 shadow-glow-purple">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center h-10 px-3 rounded-xl cursor-pointer transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 gradient-primary rounded-xl opacity-20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon active={isActive} />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] font-semibold text-primary-300 mt-0.5"
                >
                  {tab.label}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

const activeFill = 'color-mix(in srgb, var(--color-primary-300) 20%, transparent)'
const activeStroke = 'var(--color-primary-300)'
const inactiveStroke = '#6b7280'

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: active ? activeFill : 'none', stroke: active ? activeStroke : inactiveStroke }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function TasksIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: active ? activeFill : 'none', stroke: active ? activeStroke : inactiveStroke }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}

function TimerIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: active ? activeFill : 'none', stroke: active ? activeStroke : inactiveStroke }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SmartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: active ? activeFill : 'none', stroke: active ? activeStroke : inactiveStroke }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  )
}

function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ fill: active ? activeFill : 'none', stroke: active ? activeStroke : inactiveStroke }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}
