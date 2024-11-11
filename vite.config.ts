import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetifyPlugin from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  base: './',
  root: path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  server: {
    port: 8080,
    open: false,
  },
  build: {
    outDir: path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  plugins: [vue(), vuetifyPlugin({ autoImport: true })],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src', 'renderer'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
