import { createRoot } from 'react-dom/client'
import './index.css'

// Phase 1: Test if React renders at all
const root = document.getElementById('root')

if (root) {
  try {
    // Dynamically import the app to catch errors
    import('./AppWrapper').then(({ default: AppWrapper }) => {
      createRoot(root).render(<AppWrapper />)
    }).catch((err) => {
      root.innerHTML = `<div style="padding:40px;color:white">
        <h2 style="color:#f87171">Failed to load app</h2>
        <pre style="color:#94a3b8;white-space:pre-wrap;font-size:13px">${err.message}\n${err.stack}</pre>
      </div>`
    })
  } catch (err: any) {
    root.innerHTML = `<div style="padding:40px;color:white">
      <h2 style="color:#f87171">Startup error</h2>
      <pre style="color:#94a3b8">${err.message}</pre>
    </div>`
  }
}
