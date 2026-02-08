import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  // ----------------------------------------------------
  // Base path for GitHub Pages with custom domain
  // Custom domain (romamart.ca) requires root path
  // ----------------------------------------------------
  base: '/', 
  build: {
    sourcemap: false, // Disable source maps to avoid lucide-react corruption issues
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
});
