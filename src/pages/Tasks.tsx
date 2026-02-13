import { useState } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import TaskList from '../components/tasks/TaskList'
import TaskRoulette from '../components/tasks/TaskRoulette'
import { useIncompleteTasks } from '../stores/taskStore'
import { useT } from '../utils/i18n'

export default function Tasks() {
  const [showRoulette, setShowRoulette] = useState(false)
  const incompleteTasks = useIncompleteTasks()
  const t = useT()

  return (
    <PageWrapper title={t('tasks.title')}>
      <div className="space-y-4">
        <TaskList />

        {incompleteTasks.length >= 2 && (
          <div>
            <button
              onClick={() => setShowRoulette(!showRoulette)}
              className="w-full py-3.5 glass-card text-primary-300 font-semibold text-sm hover:bg-white/[0.07] transition cursor-pointer text-center"
            >
              {showRoulette ? t('tasks.roulette_hide') : t('tasks.cant_decide')}
            </button>
            {showRoulette && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden">
                <TaskRoulette />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
