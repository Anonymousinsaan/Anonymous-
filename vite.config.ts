import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      jsxRuntime: 'automatic',
    }),
    // Temporarily disabled PWA for quick deployment
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   disable: false,
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    //   },
    //   includeAssets: ['favicon.ico'],
    //   manifest: {
    //     name: 'NebulaForge X',
    //     short_name: 'NebulaForge',
    //     description: 'AI-Powered 3D Game Engine',
    //     theme_color: '#000000',
    //     background_color: '#000000',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: '/pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'styled-components', 'lucide-react'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'editor-vendor': ['@monaco-editor/react', 'codemirror', '@uiw/react-codemirror'],
          'flow-vendor': ['reactflow'],
          'utils-vendor': ['axios', 'socket.io-client', 'zustand', 'idb']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 'chunk'
          return `js/${facadeModuleId || 'chunk'}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        safari10: true
      }
    },
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    https: false,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 4173,
    cors: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@stores': '/src/stores',
      '@utils': '/src/utils',
      '@assets': '/src/assets'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'zustand',
      'axios',
      'socket.io-client'
    ],
    exclude: [
      '@monaco-editor/react',
      'reactflow'
    ]
  },
  esbuild: {
    drop: ['console', 'debugger'],
    jsxInject: `import React from 'react'`,
    target: 'esnext',
    supported: {
      'top-level-await': true
    }
  }
})