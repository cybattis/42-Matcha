import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4242,
    strictPort: true,
    host: true,
    watch: {
      usePolling: true,
    },
  },
});
