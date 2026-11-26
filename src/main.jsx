import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Old links looked like https://www.peacock.co.ug/#/product/x. Send them to the real page (/product/x).
const legacy = /^#\/(.+)$/.exec(window.location.hash)
if (legacy && window.location.pathname === '/') {
  window.location.replace('/' + legacy[1])
} else {
  const root = document.getElementById('root')
  const app = <StrictMode><App /></StrictMode>
  // Prerendered pages already contain the page: attach to them. Other pages (such as the staff dashboard) start empty.
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
