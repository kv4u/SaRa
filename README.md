# SaRa — Focus & Flow

An ADHD-friendly focus app with micro-tasks, timers, dopamine boosts, and gentle encouragement. Built with love.

## Features

- **Micro-Tasks** — Break goals into customizable time chunks with satisfying completions
- **Focus Timer** — Pomodoro-style timer (25/5) with customizable durations
- **"Just 5 Minutes"** — The lowest-barrier way to start focusing
- **Floating Task Timer** — Play any task and track time with a persistent floating bar
- **Smart Planner** — AI-powered chat that breaks down your goals into prioritized tasks
- **Dopamine Menu** — A customizable list of healthy dopamine-boosting activities
- **Task Roulette** — Can't decide? Spin the wheel!
- **Rewards System** — Points, levels, confetti celebrations, and shimmer animations
- **Streak Tracker** — Daily streaks with a grace day for off days
- **Visual Progress** — Weekly charts, daily stats, and progress rings
- **Gentle Nudges** — Encouraging affirmations and time-aware greetings
- **Bilingual** — Full English and French language support

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Deploy the AI Backend (Cloudflare Worker)

The Smart Planner uses a Cloudflare Worker to securely proxy AI requests. The API key is stored as an encrypted secret on Cloudflare — it never reaches the browser or the git repository.

### One-time setup

1. Install the Cloudflare CLI:
   ```bash
   npm install -g wrangler
   ```

2. Log in (creates a free account if needed):
   ```bash
   wrangler login
   ```

3. Install worker dependencies:
   ```bash
   cd worker
   npm install
   ```

4. Add your Groq API key as a secret (get one free at [console.groq.com](https://console.groq.com)):
   ```bash
   wrangler secret put GROQ_API_KEY
   ```

5. Deploy the worker:
   ```bash
   wrangler deploy
   ```

6. Copy the worker URL from the output and update `.env.production`:
   ```
   VITE_AI_API_URL=https://sara-ai.your-name.workers.dev
   ```

### Local development

Run the worker locally alongside the frontend:

```bash
# Terminal 1: Worker
cd worker && npx wrangler dev

# Terminal 2: Frontend
npm run dev
```

The frontend `.env` is pre-configured to use `http://localhost:8787`.

## Deploy Frontend to GitHub Pages

```bash
npm run deploy
```

## Install as App (PWA)

- **iPhone**: Open in Safari → tap Share → "Add to Home Screen"
- **Android**: Open in Chrome → tap menu → "Install app"
- **Desktop**: Click the install icon in the address bar

## Security

- API keys are stored as encrypted Cloudflare Worker secrets, never in source code
- The worker enforces CORS — only requests from the production domain are accepted
- IP-based rate limiting (10 requests/minute) prevents abuse
- Conversation history is truncated to prevent prompt injection via oversized payloads
- All user data (tasks, settings) is stored in the browser's localStorage only — nothing is sent to any server except the AI chat messages

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Framer Motion 12
- Zustand 5 (state management)
- Cloudflare Workers (AI backend proxy)
- Groq / Llama 3.3 70B (open-source AI)
- canvas-confetti
- PWA via vite-plugin-pwa

## License

AGPL-3.0 — See [LICENSE](LICENSE) for details.
