import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Animation libraries
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
              return 'animation-vendor';
            }
            // PDF generation (large library)
            if (id.includes('html2pdf.js') || id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'ui-vendor';
            }
            // Backend services
            if (id.includes('@supabase') || id.includes('firebase')) {
              return 'backend-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit to 800kb to reduce noise
    chunkSizeWarningLimit: 800,
  },
})
