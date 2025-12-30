import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and React DOM into separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split animation libraries
          'animation-vendor': ['framer-motion', 'gsap'],
          // Split other large dependencies
          'ui-vendor': ['react-icons'],
          // Split Supabase and Firebase
          'backend-vendor': ['@supabase/supabase-js', 'firebase'],
        },
      },
    },
    // Increase chunk size warning limit to 600kb (optional, but helps reduce noise)
    chunkSizeWarningLimit: 600,
  },
})
