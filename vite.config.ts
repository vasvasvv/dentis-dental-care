import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      // Вказуємо вже існуючі іконки
      includeAssets: ["favicon.ico", "favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: "Дентіс — стоматологія у Кропивницькому",
        short_name: "Дентіс",
        description: "Преміальна стоматологія у Кропивницькому. Лікування, імплантація, протезування.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#80b3b3",
        theme_color: "#c1a676",
        lang: "uk",
        categories: ["medical", "health"],
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico}"],
        globIgnores: [
    "**/*.{png,jpg,jpeg,webp,svg,gif}",
    "**/*.{woff,woff2}",
    "**/workbox-*.js",
  ],
  maximumFileSizeToCacheInBytes: 500_000,
        runtimeCaching: [
          {
            // API — завжди свіже, fallback до кешу
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            // Зображення — cache first (30 днів)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
        // Щоб не конфліктувало з vite-ssg
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
      devOptions: {
        enabled: mode === "development",
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    // ... решта твого build конфігу залишається без змін
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "lucide-react"],
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? "";
          if (name.includes("Dentis_with_Text") && !name.includes("g.")) return "assets/logo-white.webp";
          if (name.includes("Dentis_with_Textg")) return "assets/logo-gold.webp";
          if (name.includes("NeueMontreal-Bold") && name.endsWith(".woff2")) return "assets/font-bold.woff2";
          if (name.includes("NeueMontreal-Bold") && name.endsWith(".woff")) return "assets/font-bold.woff";
          if (name.includes("NeueMontreal-Medium") && name.endsWith(".woff2")) return "assets/font-medium.woff2";
          if (name.includes("NeueMontreal-Medium") && name.endsWith(".woff")) return "assets/font-medium.woff";
          if (name.includes("NeueMontreal-Regular") && name.endsWith(".woff2")) return "assets/font-regular.woff2";
          if (name.includes("NeueMontreal-Regular") && name.endsWith(".woff")) return "assets/font-regular.woff";
          if (name.includes("NeueMontreal-Light") && name.endsWith(".woff2")) return "assets/font-light.woff2";
          if (name.includes("NeueMontreal-Light") && name.endsWith(".woff")) return "assets/font-light.woff";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
  },
}));