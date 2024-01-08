import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
    UnoCSS()
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/ws": {
        target: 'ws://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    }
  }
})
