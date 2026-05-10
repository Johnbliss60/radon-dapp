import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': '{}',
  },
  resolve: {
    alias: {
      'bn.js': resolve(__dirname, 'node_modules/bn.js/lib/bn.js'),
      '@circle-fin/adapter-viem-v2': resolve(
        __dirname,
        'node_modules/@circle-fin/adapter-viem-v2/index.cjs'
      ),
    },
  },
  optimizeDeps: {
    include: [
      'bn.js',
      '@circle-fin/adapter-viem-v2',
      '@circle-fin/app-kit',
    ],
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@safe-global/safe-apps-provider',
        '@safe-global/safe-apps-sdk',
        '@safe-globalThis/safe-apps-provider',
        '@safe-globalThis/safe-apps-sdk',
      ],
      onwarn(warning, warn) {
        if (warning.message.includes('@safe-global') || 
            warning.message.includes('@safe-globalThis') ||
            warning.message.includes('safe-apps')) return
        warn(warning)
      },
    },
  },
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.circle.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})