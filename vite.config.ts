import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.js',
        vite: {
          build: {
            rollupOptions: {
              external: ['electron-store']
            }
          }
        }
      },
      {
        entry: 'electron/preload.js',
        vite: {
          build: {
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      external: ['electron']
    }
  }
});
