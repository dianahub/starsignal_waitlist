import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Simple client-side routing without react-router
const path = window.location.pathname
const isAdmin = path === '/admin'

async function boot() {
  const { default: Component } = isAdmin
    ? await import('./Admin.jsx')
    : await import('./App.jsx')

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Component />
    </StrictMode>
  )
}

boot()
