import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import DopamineCard from '../components/dopamine/DopamineCard'
import { useSettingsStore } from '../stores/settingsStore'
import { useT, getRandomItem } from '../utils/i18n'
import confetti from 'canvas-confetti'

export default function DopamineMenuPage() {
  const items = useSettingsStore((s) => s.dopamineItems)
  const addItem = useSettingsStore((s) => s.addDopamineItem)
  const removeItem = useSettingsStore((s) => s.removeDopamineItem)
  const t = useT()

  const [randomPick, setRandomPick] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmoji, setNewEmoji] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const handleRandomPick = () => {
    if (items.length === 0 || isSpinning) return
    setIsSpinning(true)
    setRandomPick(null)
    let count = 0
    const maxCount = 15
    const interval = setInterval(() => {
      const item = getRandomItem(items)
      setRandomPick(item.id)
      count++
      if (count >= maxCount) {
        clearInterval(interval)
        const final = getRandomItem(items)
        setRandomPick(final.id)
        setIsSpinning(false)
        confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 }, colors: ['#2dd4bf', '#facc15', '#4ade80', '#67e8f9'] })
      }
    }, 100)
  }

  const handleAddItem = () => {
    if (newEmoji.trim() && newLabel.trim()) {
      addItem(newEmoji.trim(), newLabel.trim())
      setNewEmoji('')
      setNewLabel('')
      setShowAddForm(false)
    }
  }

  return (
    <PageWrapper title={t('dopamine.title')}>
      <div className="space-y-3">
        {/* Rainbow boost button */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleRandomPick} disabled={isSpinning || items.length === 0}
          className="relative w-full py-4 rounded-2xl text-white font-bold text-base shadow-glow-pink disabled:opacity-50 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 gradient-rainbow opacity-90" />
          <div className="absolute inset-[2px] rounded-[14px] bg-surface-900/80" />
          <span className="relative z-10">
            {isSpinning ? t('dopamine.picking') : t('dopamine.need_boost')}
          </span>
        </motion.button>

        {/* Cards list */}
        <div className="space-y-2">
          <AnimatePresence>
            {items.map((item, i) => (
              <DopamineCard key={item.id} item={item} index={i} onRemove={removeItem} highlighted={randomPick === item.id} />
            ))}
          </AnimatePresence>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAddForm ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAddForm(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl p-5 space-y-3 max-w-lg mx-auto"
                style={{ paddingBottom: 'calc(20px + var(--safe-area-bottom))' }}
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-1" />
                <div className="flex gap-2.5">
                  <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} placeholder="🎯"
                    className="w-14 bg-white/5 border border-white/10 rounded-xl px-2.5 py-3 text-center text-lg outline-none focus:border-primary-500/50 transition" maxLength={4} />
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder={t('dopamine.activity_name')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] placeholder-gray-500 outline-none focus:border-primary-500/50 transition" autoFocus />
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl text-gray-400 bg-white/5 border border-white/5 font-semibold cursor-pointer text-[13px] hover:bg-white/10 transition">
                    {t('dopamine.cancel')}
                  </button>
                  <button onClick={handleAddItem} disabled={!newEmoji.trim() || !newLabel.trim()}
                    className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold disabled:opacity-30 cursor-pointer text-[13px] shadow-glow-purple">
                    {t('dopamine.add')}
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowAddForm(true)}
              className="w-full py-3 glass-card text-primary-400 font-semibold text-[13px] cursor-pointer hover:bg-white/[0.07] transition text-center">
              {t('dopamine.add_own')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
