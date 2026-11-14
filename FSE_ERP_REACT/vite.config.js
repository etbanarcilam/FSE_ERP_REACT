import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración de Vite realizada como aprendiz ADSO.
// Se configura el proxy hacia el backend de Laravel (puerto 8000)
// para consumir la API sin modificar el proyecto principal en PHP.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
