import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from './components/ToastContainer'
import { MenuProvider } from './contexts/MenuContext.jsx'
import { ServicesProvider } from './contexts/ServicesContext.jsx'
import { LocationsProvider } from './contexts/LocationsContext.jsx'
import { LocationProvider } from './components/LocationProvider.jsx'
import './index.css'
import App from './App.jsx'

// Initialize Google Tag Manager if VITE_GTM_ID is provided at build time
const GTM_ID = import.meta.env.VITE_GTM_ID;
if (GTM_ID) {
  // Initialize dataLayer and push gtm.start event
  window.dataLayer = window.dataLayer || [];

  // Google Consent Mode v2 defaults — must fire BEFORE gtm.js loads.
  // Clickio CMP (loaded as a GTM tag) will call gtag('consent','update',{...})
  // when the user accepts, upgrading storage from 'denied' → 'granted'.
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

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
            <LocationProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </LocationProvider>
          </LocationsProvider>
        </ServicesProvider>
      </MenuProvider>
    </HelmetProvider>
  </StrictMode>,
)
