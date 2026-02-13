import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '../../stores/taskStore'
import { useT } from '../../utils/i18n'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

type Filter = 'active' | 'completed'

export default function TaskList() {
  const [filter, setFilter] = useState<Filter>('active')
  const tasks = useTaskStore((s) => s.tasks)
  const t = useT()

  const rootTasks = tasks.filter((t) => !t.parentId)
  const activeTasks = rootTasks.filter((t) => !t.completed)
  const completedTasks = rootTasks.filter((t) => t.completed)
  const displayed = filter === 'active' ? activeTasks : completedTasks

  return (
    <div className="space-y-3">
      {/* Segmented control */}
      <div className="glass-card p-1 flex gap-1 relative">
        {(['active', 'completed'] as const).map((f) => {
          const isActive = filter === f
          const count = f === 'active' ? activeTasks.length : completedTasks.length
          const label = f === 'active' ? t('tasks.active') : t('tasks.completed')
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="relative flex-1 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer z-10"
              style={{ color: isActive ? '#fff' : '#9ca3af' }}
            >
              {isActive && (
                <motion.div
                  layoutId="task-tab"
                  className="absolute inset-0 gradient-primary rounded-xl"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayed.map((task, i) => (
            <TaskItem key={task.id} task={task} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filter === 'active' && displayed.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🎯</p>
          <p className="text-[13px] font-medium">{t('tasks.no_tasks')}</p>
        </div>
      )}
      {filter === 'completed' && displayed.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">✨</p>
          <p className="text-[13px] font-medium">{t('tasks.no_completed')}</p>
        </div>
      )}

      {filter === 'active' && <TaskForm />}
    </div>
  )
}
