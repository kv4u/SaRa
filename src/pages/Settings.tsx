import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import LanguageToggle from '../components/common/LanguageToggle'
import { useThemeStore, themes, type ThemeId } from '../stores/themeStore'
import { useT } from '../utils/i18n'
import { storage } from '../utils/storage'

const themeIds: ThemeId[] = ['teal', 'purple', 'ocean', 'sunset', 'forest']

export default function Settings() {
  const t = useT()
  const navigate = useNavigate()
  const themeId = useThemeStore((s) => s.themeId)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const handleReset = () => {
    storage.clearAll()
    setShowResetConfirm(false)
    setResetDone(true)
    setTimeout(() => window.location.reload(), 1200)
  }

  return (
    <PageWrapper title={t('settings.title')}>
      <div className="space-y-5">

        {/* Language */}
        <section className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-3">{t('settings.language')}</h3>
          <LanguageToggle />
        </section>

        {/* Theme */}
        <section className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">{t('settings.theme')}</h3>
          <div className="grid grid-cols-5 gap-3">
            {themeIds.map((id) => {
              const theme = themes[id]
              const active = id === themeId
              return (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(id)}
                  className={`flex flex-col items-center gap-2 rounded-xl py-3 px-1 cursor-pointer transition-all duration-200 ${
                    active ? 'bg-white/10 ring-2 ring-primary-400/50' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {theme.preview.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-primary-300' : 'text-gray-500'}`}>
                    {theme.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Reset */}
        <section className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-1">{t('settings.reset')}</h3>
          <p className="text-[12px] text-gray-500 mb-4">{t('settings.reset_desc')}</p>

          {!resetDone ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold cursor-pointer hover:bg-red-500/20 transition-colors"
            >
              {t('settings.reset')}
            </button>
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-sm text-green-400 font-medium py-2"
            >
              {t('settings.reset_done')}
            </motion.p>
          )}
        </section>

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 glass-card text-center text-primary-300 font-semibold text-sm cursor-pointer hover:bg-white/[0.07] transition-colors"
        >
          ← {t('nav.home')}
        </button>
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-black/60 z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[90] max-w-sm mx-auto glass-card p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-white text-center">{t('settings.reset')}</h3>
              <p className="text-sm text-gray-400 text-center leading-relaxed">{t('settings.reset_desc')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-sm font-medium text-gray-300 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {t('settings.reset_cancel')}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold cursor-pointer hover:bg-red-500/30 transition-colors"
                >
                  {t('settings.reset_confirm')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
