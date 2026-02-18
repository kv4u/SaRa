import { create } from 'zustand'
import { storage } from './storage'

export type Lang = 'en' | 'fr'

// --- Language store ---
interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangState>((set) => ({
  lang: storage.get<Lang>('lang', 'en'),
  setLang: (lang) => {
    storage.set('lang', lang)
    set({ lang })
  },
}))

// --- Translation keys ---
const translations = {
  // Nav
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.tasks': { en: 'Tasks', fr: 'Tâches' },
  'nav.timer': { en: 'Timer', fr: 'Minuteur' },
  'nav.boost': { en: 'Boost', fr: 'Boost' },
  'nav.progress': { en: 'Progress', fr: 'Progrès' },

  // Dashboard
  'dash.done': { en: 'Done', fr: 'Fait' },
  'dash.today': { en: 'today', fr: "aujourd'hui" },
  'dash.focus': { en: 'Focus', fr: 'Focus' },
  'dash.minutes': { en: 'minutes', fr: 'minutes' },
  'dash.streak': { en: 'Streak', fr: 'Série' },
  'dash.days': { en: 'days', fr: 'jours' },
  'dash.nudge_start': { en: "Haven't started yet? That's okay! Try just 5 minutes. 💜", fr: "Pas encore commencé ? C'est normal ! Essaie juste 5 minutes. 💜" },
  'dash.nudge_no_tasks': { en: 'No tasks yet — add one and start small! 🌱', fr: 'Pas encore de tâches — ajoutes-en une et commence petit ! 🌱' },
  'dash.completed_today': { en: (n: number) => `You've completed ${n} task${n !== 1 ? 's' : ''} today! Keep going! 🎉`, fr: (n: number) => `Tu as terminé ${n} tâche${n !== 1 ? 's' : ''} aujourd'hui ! Continue ! 🎉` },
  'dash.hide_roulette': { en: '🎰 Hide Roulette', fr: '🎰 Cacher la roulette' },
  'dash.show_roulette': { en: "🎰 Can't decide? Spin the wheel!", fr: '🎰 Tu hésites ? Tourne la roue !' },
  'dash.my_tasks': { en: 'My Tasks', fr: 'Mes tâches' },
  'dash.focus_timer': { en: 'Focus Timer', fr: 'Minuteur' },
  'dash.dopamine_boost': { en: 'Dopamine Boost', fr: 'Boost dopamine' },
  'dash.progress': { en: 'Progress', fr: 'Progrès' },
  'dash.active': { en: (n: number) => `${n} active`, fr: (n: number) => `${n} en cours` },

  // Tasks page
  'tasks.title': { en: 'My Tasks', fr: 'Mes tâches' },
  'tasks.active': { en: 'Active', fr: 'En cours' },
  'tasks.completed': { en: 'Completed', fr: 'Terminées' },
  'tasks.no_tasks': { en: 'No tasks yet. Add one to get started!', fr: 'Pas encore de tâches. Ajoutes-en une !' },
  'tasks.no_completed': { en: 'Complete tasks to see them here!', fr: 'Termine des tâches pour les voir ici !' },
  'tasks.add_task': { en: '+ Add Task', fr: '+ Ajouter une tâche' },
  'tasks.add_subtask': { en: '+ Add Sub-task', fr: '+ Ajouter une sous-tâche' },
  'tasks.add_subtask_link': { en: '+ Add sub-task', fr: '+ Sous-tâche' },
  'tasks.what_to_do': { en: 'What needs to be done?', fr: 'Que faut-il faire ?' },
  'tasks.cancel': { en: 'Cancel', fr: 'Annuler' },
  'tasks.add': { en: 'Add', fr: 'Ajouter' },
  'tasks.cant_decide': { en: "🎰 Can't decide? Spin!", fr: '🎰 Tu hésites ? Tourne !' },
  'tasks.roulette_hide': { en: '🎰 Hide Roulette', fr: '🎰 Cacher la roulette' },

  // Timer
  'timer.title': { en: 'Focus Timer', fr: 'Minuteur de focus' },
  'timer.minutes': { en: 'minutes', fr: 'minutes' },
  'timer.ready': { en: 'Ready to focus', fr: 'Prêt à te concentrer' },
  'timer.focus_time': { en: '🎯 Focus time...', fr: '🎯 Temps de focus...' },
  'timer.break_time': { en: '☕ Take a break!', fr: '☕ Fais une pause !' },
  'timer.session_complete': { en: '🎉 Session complete!', fr: '🎉 Session terminée !' },
  'timer.start_focus': { en: 'Start Focus', fr: 'Commencer' },
  'timer.stop': { en: 'Stop', fr: 'Arrêter' },
  'timer.keep_going': { en: 'Keep going! (+5 min)', fr: 'Continue ! (+5 min)' },
  'timer.done': { en: 'Done', fr: 'Terminé' },
  'timer.another_round': { en: 'Another Round', fr: 'Encore un tour' },
  'timer.hide_settings': { en: 'Hide settings', fr: 'Masquer les réglages' },
  'timer.show_settings': { en: '⚙️ Timer settings', fr: '⚙️ Réglages du minuteur' },
  'timer.focus_duration': { en: (n: number) => `Focus duration: ${n} min`, fr: (n: number) => `Durée de focus : ${n} min` },
  'timer.break_duration': { en: (n: number) => `Break duration: ${n} min`, fr: (n: number) => `Durée de pause : ${n} min` },
  'timer.just_5': { en: '⚡ Just 5 Minutes', fr: '⚡ Juste 5 minutes' },

  // Dopamine menu
  'dopamine.title': { en: 'Dopamine Menu', fr: 'Menu dopamine' },
  'dopamine.need_boost': { en: '⚡ I Need a Boost!', fr: '⚡ J\'ai besoin d\'un boost !' },
  'dopamine.picking': { en: '✨ Picking...', fr: '✨ Sélection...' },
  'dopamine.add_own': { en: '+ Add Your Own', fr: '+ Ajouter le tien' },
  'dopamine.activity_name': { en: 'Activity name...', fr: "Nom de l'activité..." },
  'dopamine.cancel': { en: 'Cancel', fr: 'Annuler' },
  'dopamine.add': { en: 'Add', fr: 'Ajouter' },

  // Progress
  'progress.title': { en: 'Progress', fr: 'Progrès' },
  'progress.tasks': { en: 'Tasks', fr: 'Tâches' },
  'progress.focused': { en: 'focused', fr: 'en focus' },
  'progress.points': { en: 'Points', fr: 'Points' },
  'progress.total': { en: 'total', fr: 'total' },
  'progress.activity': { en: 'Activity', fr: 'Activité' },
  'progress.day_streak': { en: 'day streak', fr: 'jours de suite' },
  'progress.this_week': { en: 'This Week', fr: 'Cette semaine' },
  'progress.3_days': { en: '3 days', fr: '3 jours' },
  'progress.1_week': { en: '1 week', fr: '1 semaine' },
  'progress.2_weeks': { en: '2 weeks', fr: '2 semaines' },
  'progress.30_days': { en: '30 days', fr: '30 jours' },

  // Rewards / Level
  'level.pts': { en: 'pts', fr: 'pts' },
  'level.pts_to': { en: (pts: number, title: string) => `${pts} pts to ${title}`, fr: (pts: number, title: string) => `${pts} pts avant ${title}` },
  'level.max': { en: "Max level reached! You're incredible! 👑", fr: 'Niveau max atteint ! Tu es incroyable ! 👑' },

  // Roulette
  'roulette.no_tasks': { en: 'Add some tasks first to use the roulette!', fr: 'Ajoute des tâches pour utiliser la roulette !' },
  'roulette.spin': { en: '🎰 Spin!', fr: '🎰 Tourne !' },
  'roulette.spinning': { en: '🎰 Spinning...', fr: '🎰 Ça tourne...' },
  'roulette.your_next': { en: 'Your next task:', fr: 'Ta prochaine tâche :' },

  // Settings
  'settings.language': { en: 'Language', fr: 'Langue' },
  'settings.title': { en: 'Settings', fr: 'Réglages' },

  // Custom duration
  'tasks.custom': { en: 'Custom', fr: 'Perso' },
  'tasks.custom_placeholder': { en: 'Min', fr: 'Min' },

  // Floating timer bar
  'timerbar.pause': { en: 'Pause', fr: 'Pause' },
  'timerbar.resume': { en: 'Resume', fr: 'Reprendre' },
  'timerbar.stop': { en: 'Stop', fr: 'Stop' },
  'timerbar.complete': { en: 'Task complete!', fr: 'Tâche terminée !' },

  // Smart Planner / AI
  'nav.smart': { en: 'Planner', fr: 'Planif.' },
  'smart.title': { en: 'Smart Planner', fr: 'Planificateur' },
  'smart.input_placeholder': { en: 'Tell me about your tasks...', fr: 'Dis-moi quelles sont tes tâches...' },
  'smart.send': { en: 'Send', fr: 'Envoyer' },
  'smart.thinking': { en: 'Thinking...', fr: 'Réflexion...' },
  'smart.add_task': { en: 'Add to Tasks', fr: 'Ajouter aux tâches' },
  'smart.added': { en: 'Added!', fr: 'Ajouté !' },
  'smart.error': { en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Réessaie.' },
  'smart.clear': { en: 'Clear Chat', fr: 'Effacer le chat' },
  'smart.welcome': { en: 'Hi! Tell me what you need to do today, this week, or this month. I\'ll help you break it down into manageable tasks.', fr: 'Salut ! Dis-moi ce que tu dois faire aujourd\'hui, cette semaine ou ce mois-ci. Je t\'aiderai à découper tes tâches.' },

  // Day labels for calendar
  'days.M': { en: 'M', fr: 'L' },
  'days.T1': { en: 'T', fr: 'M' },
  'days.W': { en: 'W', fr: 'M' },
  'days.T2': { en: 'T', fr: 'J' },
  'days.F': { en: 'F', fr: 'V' },
  'days.S1': { en: 'S', fr: 'S' },
  'days.S2': { en: 'S', fr: 'D' },
} as const

// Type-safe key
export type TransKey = keyof typeof translations

// Values can be string or function
type TransValue = string | ((...args: any[]) => string)

/**
 * Hook to get a translation function.
 * Usage:
 *   const t = useT()
 *   t('nav.home')              // => "Home" or "Accueil"
 *   t('timer.focus_duration', 25) // => "Focus duration: 25 min"
 */
export function useT() {
  const lang = useLangStore((s) => s.lang)

  return (key: TransKey, ...args: any[]): string => {
    const entry = translations[key]
    if (!entry) return key
    const val: TransValue = entry[lang] ?? entry.en
    if (typeof val === 'function') return val(...args)
    return val
  }
}

// --- Localized content (affirmations, greetings, etc.) ---

export const localizedAffirmations = {
  en: [
    "You're doing amazing, one step at a time.",
    "Progress, not perfection.",
    "Your brain is unique and wonderful.",
    "Small wins add up to big victories.",
    "You showed up today — that's what matters.",
    "Be gentle with yourself. You're doing your best.",
    "Every minute of focus is a win.",
    "You are capable of incredible things.",
    "It's okay to take breaks. Rest is productive.",
    "Believe in the power of starting small.",
    "You don't have to be perfect to be amazing.",
    "One task at a time. You've got this.",
    "Celebrate every little win today.",
    "Your effort counts, even when it's hard.",
    "You are more than your to-do list.",
    "Just showing up takes courage. Well done.",
    "Today is full of possibilities.",
    "You're making progress even when it doesn't feel like it.",
    "Your focus is a superpower — use it gently.",
    "Every step forward is worth celebrating.",
  ],
  fr: [
    "Tu fais un travail incroyable, un pas à la fois.",
    "Le progrès, pas la perfection.",
    "Ton cerveau est unique et merveilleux.",
    "Les petites victoires mènent aux grandes.",
    "Tu es là aujourd'hui — c'est ce qui compte.",
    "Sois doux avec toi-même. Tu fais de ton mieux.",
    "Chaque minute de concentration est une victoire.",
    "Tu es capable de choses incroyables.",
    "C'est normal de faire des pauses. Le repos est productif.",
    "Crois au pouvoir de commencer petit.",
    "Tu n'as pas besoin d'être parfait pour être extraordinaire.",
    "Une tâche à la fois. Tu vas y arriver.",
    "Célèbre chaque petite victoire aujourd'hui.",
    "Ton effort compte, même quand c'est difficile.",
    "Tu es bien plus que ta liste de tâches.",
    "Juste se montrer demande du courage. Bravo.",
    "Aujourd'hui est plein de possibilités.",
    "Tu progresses même quand tu ne le sens pas.",
    "Ta concentration est un super-pouvoir — utilise-le doucement.",
    "Chaque pas en avant mérite d'être célébré.",
  ],
}

export const localizedCompletionMessages = {
  en: [
    "Incredible! You crushed it! 🎉",
    "Look at you go! Amazing! ✨",
    "Task complete! You're on fire! 🔥",
    "Boom! Another one done! 💪",
    "You're unstoppable today! 🚀",
    "Fantastic work! Keep flowing! 🌊",
    "That's how it's done! Brilliant! ⭐",
    "Woohoo! You did it! 🎊",
    "Nailed it! You're amazing! 💜",
    "Yes! One more win for you! 🏆",
  ],
  fr: [
    "Incroyable ! Tu as tout déchiré ! 🎉",
    "Regarde-toi ! Magnifique ! ✨",
    "Tâche terminée ! Tu es en feu ! 🔥",
    "Boom ! Encore une de faite ! 💪",
    "Tu es inarrêtable aujourd'hui ! 🚀",
    "Travail fantastique ! Continue ! 🌊",
    "C'est comme ça qu'on fait ! Brillant ! ⭐",
    "Youpi ! Tu l'as fait ! 🎊",
    "Parfait ! Tu es incroyable ! 💜",
    "Oui ! Encore une victoire ! 🏆",
  ],
}

export const localizedGreetings = {
  en: {
    morning: ["Good morning, sunshine! ☀️", "Rise and shine! A new day awaits! 🌅", "Good morning! Ready for some wins? ✨"],
    afternoon: ["Good afternoon! Keep the momentum! 💪", "Hey there! The day's still young! 🌤️", "Afternoon vibes! You're doing great! 🌈"],
    evening: ["Good evening! Wind down gently. 🌙", "Hey! What a day — you showed up! 🌟", "Evening time! You deserve rest. 💜"],
  },
  fr: {
    morning: ["Bonjour, rayon de soleil ! ☀️", "Debout ! Une nouvelle journée t'attend ! 🌅", "Bonjour ! Prêt pour des victoires ? ✨"],
    afternoon: ["Bon après-midi ! Garde l'élan ! 💪", "Salut ! La journée est encore jeune ! 🌤️", "Bonne après-midi ! Tu t'en sors super ! 🌈"],
    evening: ["Bonsoir ! Détends-toi doucement. 🌙", "Salut ! Quelle journée — tu as assuré ! 🌟", "C'est le soir ! Tu mérites du repos. 💜"],
  },
}

export const localizedLevelTitles = {
  en: [
    'Focus Seedling 🌱', 'Task Sprout 🌿', 'Flow Finder 🌊', 'Focus Star ⭐',
    'Momentum Builder 🔥', 'Focus Warrior ⚔️', 'Dopamine Queen 👑', 'Legendary Focus 💜',
  ],
  fr: [
    'Graine de focus 🌱', 'Pousse de tâche 🌿', 'Chercheur de flow 🌊', 'Étoile du focus ⭐',
    'Bâtisseur d\'élan 🔥', 'Guerrier du focus ⚔️', 'Reine de la dopamine 👑', 'Focus légendaire 💜',
  ],
}

export const localizedDopamineItems = {
  en: [
    { emoji: '🚶', label: 'Take a walk' },
    { emoji: '🎵', label: 'Listen to music' },
    { emoji: '🧘', label: 'Stretch' },
    { emoji: '💧', label: 'Drink water' },
    { emoji: '🍎', label: 'Eat a snack' },
    { emoji: '💃', label: 'Dance it out' },
    { emoji: '🎨', label: 'Doodle' },
    { emoji: '🐾', label: 'Pet an animal' },
    { emoji: '📞', label: 'Call a friend' },
    { emoji: '🌿', label: 'Go outside' },
    { emoji: '📖', label: 'Read something fun' },
    { emoji: '🫧', label: 'Take deep breaths' },
  ],
  fr: [
    { emoji: '🚶', label: 'Faire une promenade' },
    { emoji: '🎵', label: 'Écouter de la musique' },
    { emoji: '🧘', label: 'S\'étirer' },
    { emoji: '💧', label: 'Boire de l\'eau' },
    { emoji: '🍎', label: 'Manger un snack' },
    { emoji: '💃', label: 'Danser' },
    { emoji: '🎨', label: 'Gribouiller' },
    { emoji: '🐾', label: 'Caresser un animal' },
    { emoji: '📞', label: 'Appeler un ami' },
    { emoji: '🌿', label: 'Aller dehors' },
    { emoji: '📖', label: 'Lire quelque chose d\'amusant' },
    { emoji: '🫧', label: 'Prendre de grandes respirations' },
  ],
}

// Helper: get random item
export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper: get localized greeting
export function getLocalizedGreeting(lang: Lang): string {
  const hour = new Date().getHours()
  const g = localizedGreetings[lang]
  if (hour < 12) return getRandomItem(g.morning)
  if (hour < 17) return getRandomItem(g.afternoon)
  return getRandomItem(g.evening)
}
