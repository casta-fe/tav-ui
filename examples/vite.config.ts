import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import windiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), windiCSS()],
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
  optimizeDeps: {
    include: ['vue', '@vue/shared'],
  },
})
