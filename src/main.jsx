import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from './components/ToastContainer'
import { MenuProvider } from './contexts/MenuContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <MenuProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MenuProvider>
    </HelmetProvider>
  </StrictMode>,
)
