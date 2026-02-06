import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get your repository name from the URL: github.com/username/repository-name
const REPO_NAME = 'romamart.ca';

// Environment-based base path
// Staging (GitHub Pages): /romamart.ca/
// Production (Custom domain): /
const BASE_PATH = process.env.VITE_STAGING === 'true' ? `/${REPO_NAME}/` : '/';

export default defineConfig({
  plugins: [
    react(),
  ],
  // ----------------------------------------------------
  // Base path controlled by VITE_STAGING environment variable
  // Staging (GitHub Pages subdomain): /${REPO_NAME}/
  // Production (custom domain or Netlify): /
  // ----------------------------------------------------
  base: BASE_PATH, 
  build: {
    sourcemap: false, // Disable source maps to avoid lucide-react corruption issues
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react', '@fortawesome/react-fontawesome'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
});
