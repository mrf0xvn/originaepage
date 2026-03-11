import React from 'react'
import ReactDOM from 'react-dom/client'
import { LandingPage } from './index.tsx'
import './tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>,
)
