import { create } from 'zustand'
import { storage } from '../utils/storage'

export interface DopamineItem {
  id: string
  emoji: string
  label: string
}

const defaultDopamineItems: DopamineItem[] = [
  { id: '1', emoji: '🚶', label: 'Take a walk' },
  { id: '2', emoji: '🎵', label: 'Listen to music' },
  { id: '3', emoji: '🧘', label: 'Stretch' },
  { id: '4', emoji: '💧', label: 'Drink water' },
  { id: '5', emoji: '🍎', label: 'Eat a snack' },
  { id: '6', emoji: '💃', label: 'Dance it out' },
  { id: '7', emoji: '🎨', label: 'Doodle' },
  { id: '8', emoji: '🐾', label: 'Pet an animal' },
  { id: '9', emoji: '📞', label: 'Call a friend' },
  { id: '10', emoji: '🌿', label: 'Go outside' },
  { id: '11', emoji: '📖', label: 'Read something fun' },
  { id: '12', emoji: '🫧', label: 'Take deep breaths' },
]

// Points needed per level
export const levelThresholds = [
  { level: 1, title: 'Focus Seedling 🌱', points: 0 },
  { level: 2, title: 'Task Sprout 🌿', points: 50 },
  { level: 3, title: 'Flow Finder 🌊', points: 150 },
  { level: 4, title: 'Focus Star ⭐', points: 300 },
  { level: 5, title: 'Momentum Builder 🔥', points: 500 },
  { level: 6, title: 'Focus Warrior ⚔️', points: 800 },
  { level: 7, title: 'Dopamine Queen 👑', points: 1200 },
  { level: 8, title: 'Legendary Focus 💜', points: 2000 },
]

export function getLevelInfo(points: number) {
  let current = levelThresholds[0]
  let next = levelThresholds[1]
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i].points) {
      current = levelThresholds[i]
      next = levelThresholds[i + 1] || null
      break
    }
  }
  const progressToNext = next
    ? (points - current.points) / (next.points - current.points)
    : 1
  return { current, next, progressToNext }
}

export function getPointsForDuration(duration: number): number {
  if (duration <= 5) return 5
  if (duration <= 10) return 15
  if (duration <= 15) return 25
  return Math.round(duration * 1.5)
}

interface SettingsState {
  // Points & Streaks
  totalPoints: number
  streakDays: number
  lastActiveDate: string
  graceDayUsed: boolean
  completedDates: string[]

  // Focus timer settings
  focusDuration: number
  breakDuration: number
  totalFocusMinutesToday: number
  lastFocusDate: string

  // Dopamine menu
  dopamineItems: DopamineItem[]

  // AI settings
  aiApiKey: string
  aiProvider: 'gemini' | 'openai-compatible'
  aiBaseUrl: string

  // Actions
  addPoints: (pts: number) => void
  recordFocusMinutes: (mins: number) => void
  updateStreak: () => void
  addDopamineItem: (emoji: string, label: string) => void
  removeDopamineItem: (id: string) => void
  setFocusDuration: (mins: number) => void
  setBreakDuration: (mins: number) => void
  setAiApiKey: (key: string) => void
  setAiProvider: (provider: 'gemini' | 'openai-compatible') => void
  setAiBaseUrl: (url: string) => void
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  totalPoints: storage.get('totalPoints', 0),
  streakDays: storage.get('streakDays', 0),
  lastActiveDate: storage.get('lastActiveDate', ''),
  graceDayUsed: storage.get('graceDayUsed', false),
  completedDates: storage.get<string[]>('completedDates', []),
  focusDuration: storage.get('focusDuration', 25),
  breakDuration: storage.get('breakDuration', 5),
  totalFocusMinutesToday: storage.get('totalFocusMinutesToday', 0),
  lastFocusDate: storage.get('lastFocusDate', ''),
  dopamineItems: storage.get<DopamineItem[]>('dopamineItems', defaultDopamineItems),
  aiApiKey: storage.get('aiApiKey', ''),
  aiProvider: storage.get<'gemini' | 'openai-compatible'>('aiProvider', 'gemini'),
  aiBaseUrl: storage.get('aiBaseUrl', 'https://generativelanguage.googleapis.com'),

  addPoints: (pts) => {
    const newTotal = get().totalPoints + pts
    storage.set('totalPoints', newTotal)
    set({ totalPoints: newTotal })
  },

  recordFocusMinutes: (mins) => {
    const today = todayStr()
    let current = get().totalFocusMinutesToday
    if (get().lastFocusDate !== today) {
      current = 0
    }
    const newTotal = current + mins
    storage.set('totalFocusMinutesToday', newTotal)
    storage.set('lastFocusDate', today)
    set({ totalFocusMinutesToday: newTotal, lastFocusDate: today })
  },

  updateStreak: () => {
    const today = todayStr()
    const state = get()

    if (state.lastActiveDate === today) return // Already recorded today

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0]

    let newStreak = state.streakDays
    let graceDayUsed = state.graceDayUsed

    if (state.lastActiveDate === yesterdayStr) {
      newStreak += 1
      graceDayUsed = false
    } else if (state.lastActiveDate === twoDaysAgoStr && !state.graceDayUsed) {
      // Grace day — missed yesterday but active 2 days ago
      newStreak += 1
      graceDayUsed = true
    } else if (state.lastActiveDate && state.lastActiveDate !== today) {
      newStreak = 1 // Streak broken, start fresh
      graceDayUsed = false
    } else {
      newStreak = 1 // First time
    }

    const dates = [...state.completedDates]
    if (!dates.includes(today)) dates.push(today)

    storage.set('streakDays', newStreak)
    storage.set('lastActiveDate', today)
    storage.set('graceDayUsed', graceDayUsed)
    storage.set('completedDates', dates)

    set({
      streakDays: newStreak,
      lastActiveDate: today,
      graceDayUsed,
      completedDates: dates,
    })
  },

  addDopamineItem: (emoji, label) => {
    const items = [
      ...get().dopamineItems,
      { id: crypto.randomUUID(), emoji, label },
    ]
    storage.set('dopamineItems', items)
    set({ dopamineItems: items })
  },

  removeDopamineItem: (id) => {
    const items = get().dopamineItems.filter((i) => i.id !== id)
    storage.set('dopamineItems', items)
    set({ dopamineItems: items })
  },

  setFocusDuration: (mins) => {
    storage.set('focusDuration', mins)
    set({ focusDuration: mins })
  },

  setBreakDuration: (mins) => {
    storage.set('breakDuration', mins)
    set({ breakDuration: mins })
  },

  setAiApiKey: (key) => {
    storage.set('aiApiKey', key)
    set({ aiApiKey: key })
  },

  setAiProvider: (provider) => {
    storage.set('aiProvider', provider)
    set({ aiProvider: provider })
  },

  setAiBaseUrl: (url) => {
    storage.set('aiBaseUrl', url)
    set({ aiBaseUrl: url })
  },
}))
