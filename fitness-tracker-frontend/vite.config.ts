import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Athlo',
        short_name: 'Athlo',
        start_url: '/',
        display: 'standalone',
        background_color: '#2c2c2c',
        theme_color: '#2c2c2c',
        icons: [
          {
            src: '/icons/athlo-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/athlo-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/'
})
