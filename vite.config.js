import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
}) 