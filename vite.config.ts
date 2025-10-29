import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: For GitHub Pages deployment, change '/' to your repository name.
  // For example, if your repository is `https://github.com/user/my-app`,
  // set base to '/my-app/'.
  base: '/',
  plugins: [react()],
  publicDir: 'public',
})
