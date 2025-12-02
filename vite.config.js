js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/webtest/',  // sustituye 'webtest' por el nombre exacto de tu repo
  plugins: [react()],
})
