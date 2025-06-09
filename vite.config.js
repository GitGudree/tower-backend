import { defineConfig } from 'vite'
import path from 'path';

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
  },
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
      login: path.resolve(__dirname, 'login.html'),
    },
  },
});