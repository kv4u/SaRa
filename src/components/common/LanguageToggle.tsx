import { motion } from 'framer-motion'
import { useLangStore, type Lang } from '../../utils/i18n'

export default function LanguageToggle() {
  const lang = useLangStore((s) => s.lang)
  const setLang = useLangStore((s) => s.setLang)

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'fr' : 'en'
    setLang(next)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors"
    >
      <span className="text-sm">{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
      <span className="text-[11px] font-bold text-primary-300 uppercase tracking-wider">{lang}</span>
    </motion.button>
  )
}
