import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// After a new deploy, a tab running the old version may request page files
// that no longer exist. Reload once to pick up the new version instead of
// showing a blank screen. The time guard prevents a reload loop.
const RELOAD_KEY = 'likita24-chunk-reload-at'
window.addEventListener('vite:preloadError', (event) => {
  let last = 0
  try { last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0 } catch { /* storage unavailable */ }
  if (Date.now() - last < 10_000) return // already tried; let the error surface
  event.preventDefault()
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())) } catch { /* storage unavailable */ }
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
