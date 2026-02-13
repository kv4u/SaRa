import { create } from 'zustand'
import { storage } from '../utils/storage'

export interface Task {
  id: string
  title: string
  duration: 5 | 10 | 15
  completed: boolean
  completedAt?: string
  createdAt: string
  parentId?: string
}

interface TaskState {
  tasks: Task[]
  addTask: (title: string, duration: 5 | 10 | 15, parentId?: string) => Task
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  editTask: (id: string, title: string, duration: 5 | 10 | 15) => void
}

const loadTasks = (): Task[] => storage.get<Task[]>('tasks', [])
const saveTasks = (tasks: Task[]) => storage.set('tasks', tasks)

export const useTaskStore = create<TaskState>((set) => ({
  tasks: loadTasks(),

  addTask: (title, duration, parentId) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      duration,
      completed: false,
      createdAt: new Date().toISOString(),
      parentId,
    }
    set((state) => {
      const tasks = [...state.tasks, task]
      saveTasks(tasks)
      return { tasks }
    })
    return task
  },

  toggleTask: (id) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
      saveTasks(tasks)
      return { tasks }
    })
  },

  deleteTask: (id) => {
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id && t.parentId !== id)
      saveTasks(tasks)
      return { tasks }
    })
  },

  editTask: (id, title, duration) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, title, duration } : t
      )
      saveTasks(tasks)
      return { tasks }
    })
  },
}))

// --- Helper hooks for derived data (use these in components) ---

import { useMemo } from 'react'

export function useIncompleteTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  return useMemo(() => tasks.filter((t) => !t.completed && !t.parentId), [tasks])
}

export function useTodayCompleted() {
  const tasks = useTaskStore((s) => s.tasks)
  return useMemo(() => {
    const today = new Date().toDateString()
    return tasks.filter(
      (t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
    )
  }, [tasks])
}

export function useSubTasks(parentId: string) {
  const tasks = useTaskStore((s) => s.tasks)
  return useMemo(() => tasks.filter((t) => t.parentId === parentId), [tasks, parentId])
}
