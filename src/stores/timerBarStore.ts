import { create } from 'zustand'
import type { Task } from './taskStore'

interface TimerBarState {
  taskId: string | null
  taskTitle: string
  totalSeconds: number
  secondsLeft: number
  isRunning: boolean
  startTask: (task: Task) => void
  tick: () => void
  pause: () => void
  resume: () => void
  stop: () => void
}

export const useTimerBarStore = create<TimerBarState>((set, get) => ({
  taskId: null,
  taskTitle: '',
  totalSeconds: 0,
  secondsLeft: 0,
  isRunning: false,

  startTask: (task: Task) => {
    set({
      taskId: task.id,
      taskTitle: task.title,
      totalSeconds: task.duration * 60,
      secondsLeft: task.duration * 60,
      isRunning: true,
    })
  },

  tick: () => {
    const { secondsLeft, isRunning } = get()
    if (!isRunning || secondsLeft <= 0) return
    set({ secondsLeft: secondsLeft - 1 })
  },

  pause: () => set({ isRunning: false }),

  resume: () => set({ isRunning: true }),

  stop: () =>
    set({
      taskId: null,
      taskTitle: '',
      totalSeconds: 0,
      secondsLeft: 0,
      isRunning: false,
    }),
}))
