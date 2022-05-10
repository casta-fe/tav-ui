import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import windiCSS from 'vite-plugin-windicss';

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
});
