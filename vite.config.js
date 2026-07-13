import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const googleMapsKeyForProxy = env.GOOGLE_MAPS_API_KEY || ''
  const mapsDevProxyEnabled = mode === 'development' && Boolean(googleMapsKeyForProxy)

  return {
  plugins: [react()],
  base: '/',
  define: {
    __MAPS_DEV_PROXY__: JSON.stringify(mapsDevProxyEnabled),
  },
  server: mapsDevProxyEnabled
    ? {
        proxy: {
          '/__google-maps': {
            target: 'https://maps.googleapis.com/maps/api',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/__google-maps/, ''),
            configure(proxy) {
              proxy.on('proxyReq', (proxyReq) => {
                const pathWithQuery = proxyReq.path || ''
                const sep = pathWithQuery.includes('?') ? '&' : '?'
                proxyReq.path = `${pathWithQuery}${sep}key=${encodeURIComponent(googleMapsKeyForProxy)}`
              })
            },
          },
        },
      }
    : undefined,
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
            // Backend services - split to avoid circular init / TDZ in one chunk
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
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
  }
})
