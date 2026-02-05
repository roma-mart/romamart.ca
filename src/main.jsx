import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from './components/ToastContainer'
import { MenuProvider } from './contexts/MenuContext.jsx'
import { ServicesProvider } from './contexts/ServicesContext.jsx'
import { LocationsProvider } from './contexts/LocationsContext.jsx'
import './index.css'
import App from './App.jsx'

// Initialize Google Tag Manager if VITE_GTM_ID is provided at build time
const GTM_ID = import.meta.env.VITE_GTM_ID;
if (GTM_ID) {
  // Initialize dataLayer and push gtm.start event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // Create GTM script element
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtmScript);

  // Also create noscript fallback iframe for no-JS environments
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
}

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
