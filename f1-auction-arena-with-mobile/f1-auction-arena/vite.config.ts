import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/f1-auction-arena/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        mobile: 'mobile/index.html',
      },
    },
  },
})
