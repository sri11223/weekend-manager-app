import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Use development-like settings for better performance
    minify: mode === 'development' ? false : 'esbuild',
    sourcemap: mode === 'development' ? true : false,
    // Prevent aggressive optimization that causes re-render issues
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
    rollupOptions: {
      output: {
        // Don't split chunks in development mode
        manualChunks: mode === 'development' ? undefined : {
          vendor: ['react', 'react-dom'],
          dnd: ['react-dnd', 'react-dnd-html5-backend'],
        }
      }
    }
  }
}))
