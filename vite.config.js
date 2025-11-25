import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get your repository name from the URL: github.com/username/repository-name
// *** IMPORTANT: Replace 'roma-mart-site' with the actual name of your GitHub repo ***
const REPO_NAME = 'romamart.ca'; 

export default defineConfig({
  plugins: [react()],
  // ----------------------------------------------------
  // IMPORTANT: This sets the correct base path for assets
  // ----------------------------------------------------
  base: `/${REPO_NAME}/`, 
});