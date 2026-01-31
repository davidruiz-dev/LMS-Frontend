import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@/lib": path.resolve(__dirname, "./src/shared/lib"),
      "@/types": path.resolve(__dirname, './src/shared/types'),
      "@/features": path.resolve(__dirname, './src/features'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-button', '@radix-ui/react-dialog'],
          query: ['@tanstack/react-query', 'axios'],
        },
      },
    },
  },
})
