import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
   plugins: [
      react(),
      tailwindcss(),
      VitePWA({
         registerType: 'autoUpdate',
         manifest: {
            name: 'Ethos CMS',
            short_name: 'Ethos CMS',
            description:
               'This is an internal application for authors of the Ethos Blog.',
            theme_color: '#f1f5f9',
            background_color: '#f1f5f9',
            display: 'standalone',
            start_url: '/',
            icons: [
               {
                  src: '/assets/logo-pwa.png',
                  sizes: '192x192',
                  type: 'image/png',
               },
            ],
         },
         workbox: {
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
         },
      }),
   ],
});
