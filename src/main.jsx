import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from './components/ToastContainer'
import { MenuProvider } from './contexts/MenuContext.jsx'
import { ServicesProvider } from './contexts/ServicesContext.jsx'
import { LocationsProvider } from './contexts/LocationsContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <MenuProvider>
        <ServicesProvider>
          <LocationsProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </LocationsProvider>
        </ServicesProvider>
      </MenuProvider>
    </HelmetProvider>
  </StrictMode>,
)
