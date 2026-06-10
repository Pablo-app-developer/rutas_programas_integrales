import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Rutas relativas: funciona tanto en la raíz (Vercel) como en subdirectorio
  base: './',
})
