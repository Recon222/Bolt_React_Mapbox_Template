import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['mapbox-gl'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mapgl: ['react-map-gl']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react-map-gl']
  }
})
