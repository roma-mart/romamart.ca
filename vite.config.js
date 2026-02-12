import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* global process */

export default defineConfig({
  plugins: [react()],
  // ----------------------------------------------------
  // Base path for GitHub Pages with custom domain
  // Custom domain (romamart.ca) requires root path
  // ----------------------------------------------------
  base: '/',
  server: {
    // Proxy Netlify API requests in dev to bypass CORS restrictions.
    // The API CORS allowlist only includes specific origins (localhost:5173,
    // romamart.ca, roma-mart.github.io). When the dev server binds to a
    // different port, browser CORS blocks the requests. This proxy routes
    // /api/* requests through Vite's server, avoiding CORS entirely.
    proxy: {
      // D25: Compliance API proxied separately from public APIs
      // When VITE_API_URL is set, compliance requests go to that backend.
      // Otherwise mock API handles them in-browser (no proxy needed).
      ...(process.env.VITE_API_URL
        ? {
            '/api/compliance': {
              target: process.env.VITE_API_URL,
              changeOrigin: true,
              secure: false,
            },
          }
        : {}),
      // Public API proxy (Netlify) -- must come after /api/compliance
      '/api': {
        target: 'https://romamart.netlify.app',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false, // Disable source maps to avoid lucide-react corruption issues
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          icons: ['lucide-react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
