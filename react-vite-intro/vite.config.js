import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Настройка Webpack для обработки SVG
      'react-svg-loader': '@svgr/webpack',
    },
  },
});
