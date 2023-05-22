import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import windiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), windiCSS()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#276dff',
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    // Listening on all local IPs
    host: true,
    port: 3002,
    // Load proxy configuration from .env
    proxy: {
      '/api': {
        target: 'http://192.168.10.29:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['vue', '@vue/shared'],
  },
})
