import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
