import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', '*.webp'],
        manifest: {
          name: 'Family Games',
          short_name: 'FamilyGames',
          description: 'Trò chơi gia đình: Ai là người giả mạo, Tôi là ai, Cờ caro, Đoán từ',
          theme_color: '#B2FF3D',
          icons: [
            { src: 'familygame.webp', sizes: '192x192', type: 'image/webp' },
            { src: 'familygame.webp', sizes: '512x512', type: 'image/webp' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            icons: ['lucide-react'],
            games: [
              './src/components/CaroGame.tsx',
              './src/components/DoanTuGame.tsx',
              './src/components/GameStages.tsx',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 550,
    },
  };
});
