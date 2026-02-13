import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FocusTimer from './FocusTimer'
import { useT } from '../../utils/i18n'

export default function JustFiveMinutes() {
  const [active, setActive] = useState(false)
  const t = useT()

  return (
    <div>
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.button key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            whileTap={{ scale: 0.97 }} onClick={() => setActive(true)}
            className="w-full py-3.5 gradient-primary text-white font-bold rounded-2xl text-base shadow-glow-purple animate-pulse-glow cursor-pointer">
            {t('timer.just_5')}
          </motion.button>
        ) : (
          <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5">
            <FocusTimer initialMinutes={5} isJustFiveMinutes onComplete={() => {}} />
            <button onClick={() => setActive(false)} className="mt-4 w-full text-center text-[13px] text-gray-500 hover:text-primary-300 transition cursor-pointer font-medium">
              {t('tasks.cancel')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
