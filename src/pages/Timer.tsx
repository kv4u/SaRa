import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import FocusTimer from '../components/timer/FocusTimer'
import { useSettingsStore } from '../stores/settingsStore'
import { useT } from '../utils/i18n'

export default function Timer() {
  const focusDuration = useSettingsStore((s) => s.focusDuration)
  const breakDuration = useSettingsStore((s) => s.breakDuration)
  const setFocusDuration = useSettingsStore((s) => s.setFocusDuration)
  const setBreakDuration = useSettingsStore((s) => s.setBreakDuration)
  const [showSettings, setShowSettings] = useState(false)
  const t = useT()

  return (
    <PageWrapper title={t('timer.title')}>
      <div className="flex flex-col items-center pt-2">
        <FocusTimer />

        <button onClick={() => setShowSettings(!showSettings)} className="mt-8 text-sm text-gray-500 hover:text-primary-300 transition cursor-pointer font-medium">
          {showSettings ? t('timer.hide_settings') : t('timer.show_settings')}
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mt-4 overflow-hidden"
            >
              <div className="glass-card p-5 space-y-5">
                <div>
                  <label className="text-sm text-gray-400 block mb-3 font-medium">{t('timer.focus_duration', focusDuration)}</label>
                  <input type="range" min={5} max={60} step={5} value={focusDuration} onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-full accent-primary-500 h-2 rounded-full" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-3 font-medium">{t('timer.break_duration', breakDuration)}</label>
                  <input type="range" min={1} max={15} step={1} value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-full accent-primary-500 h-2 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
