import { create } from 'zustand'
import { storage } from '../utils/storage'

export type ThemeId = 'teal' | 'purple' | 'ocean' | 'sunset' | 'forest'

interface ThemePalette {
  primary: Record<string, string>
  surface: Record<string, string>
  bodyBg: string
  ambient: [string, string, string]
}

export const themes: Record<ThemeId, { label: string; preview: string[]; palette: ThemePalette }> = {
  teal: {
    label: 'Teal',
    preview: ['#14b8a6', '#0d9488', '#06b6d4'],
    palette: {
      primary: {
        '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4',
        '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e',
        '800': '#115e59', '900': '#134e4a', '950': '#042f2e',
      },
      surface: { '50': '#f0f9ff', '100': '#e0f2fe', '800': '#132237', '900': '#0d1929', '950': '#0b1121' },
      bodyBg: '#0b1121',
      ambient: ['rgba(20,184,166,0.08)', 'rgba(6,182,212,0.06)', 'rgba(14,165,233,0.04)'],
    },
  },
  purple: {
    label: 'Purple',
    preview: ['#a855f7', '#7c3aed', '#c084fc'],
    palette: {
      primary: {
        '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
        '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7c3aed',
        '800': '#6b21a8', '900': '#581c87', '950': '#3b0764',
      },
      surface: { '50': '#faf5ff', '100': '#f3e8ff', '800': '#1e1533', '900': '#150e24', '950': '#0f0a1a' },
      bodyBg: '#0f0a1a',
      ambient: ['rgba(168,85,247,0.08)', 'rgba(192,132,252,0.06)', 'rgba(139,92,246,0.04)'],
    },
  },
  ocean: {
    label: 'Ocean',
    preview: ['#3b82f6', '#2563eb', '#60a5fa'],
    palette: {
      primary: {
        '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
        '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
        '800': '#1e40af', '900': '#1e3a8a', '950': '#172554',
      },
      surface: { '50': '#eff6ff', '100': '#dbeafe', '800': '#131d37', '900': '#0d1529', '950': '#0a0f1f' },
      bodyBg: '#0a0f1f',
      ambient: ['rgba(59,130,246,0.08)', 'rgba(96,165,250,0.06)', 'rgba(56,189,248,0.04)'],
    },
  },
  sunset: {
    label: 'Sunset',
    preview: ['#f97316', '#ea580c', '#fb923c'],
    palette: {
      primary: {
        '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74',
        '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c',
        '800': '#9a3412', '900': '#7c2d12', '950': '#431407',
      },
      surface: { '50': '#fff7ed', '100': '#ffedd5', '800': '#261a0e', '900': '#1a1008', '950': '#120c08' },
      bodyBg: '#120c08',
      ambient: ['rgba(249,115,22,0.08)', 'rgba(251,146,60,0.06)', 'rgba(245,158,11,0.04)'],
    },
  },
  forest: {
    label: 'Forest',
    preview: ['#22c55e', '#16a34a', '#4ade80'],
    palette: {
      primary: {
        '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac',
        '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d',
        '800': '#166534', '900': '#14532d', '950': '#052e16',
      },
      surface: { '50': '#f0fdf4', '100': '#dcfce7', '800': '#112017', '900': '#0a1610', '950': '#080f0b' },
      bodyBg: '#080f0b',
      ambient: ['rgba(34,197,94,0.08)', 'rgba(74,222,128,0.06)', 'rgba(16,185,129,0.04)'],
    },
  },
}

function applyTheme(id: ThemeId) {
  const { palette } = themes[id]
  const root = document.documentElement

  for (const [shade, color] of Object.entries(palette.primary)) {
    root.style.setProperty(`--color-primary-${shade}`, color)
  }
  for (const [shade, color] of Object.entries(palette.surface)) {
    root.style.setProperty(`--color-surface-${shade}`, color)
  }

  root.style.setProperty('--theme-bg', palette.bodyBg)
  root.style.setProperty('--theme-ambient-1', palette.ambient[0])
  root.style.setProperty('--theme-ambient-2', palette.ambient[1])
  root.style.setProperty('--theme-ambient-3', palette.ambient[2])
  document.body.style.background = palette.bodyBg
}

interface ThemeState {
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
}

export const useThemeStore = create<ThemeState>((set) => {
  const saved = storage.get<ThemeId>('themeId', 'teal')
  setTimeout(() => applyTheme(saved), 0)

  return {
    themeId: saved,
    setTheme: (id) => {
      storage.set('themeId', id)
      applyTheme(id)
      set({ themeId: id })
    },
  }
})
