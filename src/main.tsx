import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Mark app as loaded for initial loading screen
document.body.classList.add('app-loaded')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)