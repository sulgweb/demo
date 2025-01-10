/*
 * @Description:
 * @Author: xiaoyu
 * @LastEditors: xiaoyu
 * @Date: 2022-06-17 16:13:55
 * @LastEditTime: 2022-06-22 22:03:19
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import wasm from 'vite-plugin-wasm';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      //生成压缩包
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
      // algorithm: 'brotliCompress',
      // ext: '.br',
    }),
    wasm(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // 主题修改
          // '@primary-color': '#a652ff', // 全局主色
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
