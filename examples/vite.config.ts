import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import windiCSS from 'vite-plugin-windicss'
import DefineOptions from 'unplugin-vue-define-options/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), windiCSS(), DefineOptions()],
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
    // proxy: {
    //   '/api': {
    //     target: '192.168.10.52:80',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  // server: {
  //   // Listening on all local IPs
  //   host: true,
  //   port: 3003,
  // },
  optimizeDeps: {
    include: ['vue', '@vue/shared'],
  },
})
