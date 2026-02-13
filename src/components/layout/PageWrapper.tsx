import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
}

export default function PageWrapper({ children, title }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-full px-4 pt-5 pb-nav"
    >
      {title && (
        <h1 className="text-[22px] font-extrabold text-white mb-4 tracking-tight">{title}</h1>
      )}
      {children}
    </motion.div>
  )
}
