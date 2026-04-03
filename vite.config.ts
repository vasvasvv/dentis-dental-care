import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["favicon.ico", "favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: "Дентіс — стоматологія у Кропивницькому",
        short_name: "Дентіс",
        description: "Преміальна стоматологія у Кропивницькому. Лікування, імплантація, протезування.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0a3333",
        theme_color: "#c1a676",
        lang: "uk",
        categories: ["medical", "health"],
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png}"],
        globIgnores: ["**/*.{webp,svg,woff,woff2}", "**/workbox-*.js"],
        maximumFileSizeToCacheInBytes: 500_000,
      },
      devOptions: { enabled: mode === "development", type: "module" },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    reportCompressedSize: false,
    cssMinify: "esbuild",
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : {
              "vendor-react": ["react", "react-dom", "react-router-dom"],
              "vendor-ui": ["lucide-react"],
              "vendor-motion": ["framer-motion"],
              "vendor-helmet": ["react-helmet-async"],
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
  ssgOptions: {
    includedRoutes: () => [
      "/",
      "/en",
      "/implantaciya",
      "/en/implantaciya",
      "/protezuvannya",
      "/en/protezuvannya",
      "/likuvannya-kariesu",
      "/en/likuvannya-kariesu",
      "/profesijne-ochischennya",
      "/en/profesijne-ochischennya",
      "/estetychna-stomatolohiya",
      "/en/estetychna-stomatolohiya",
      "/diagnostika-zubiv",
      "/en/diagnostika-zubiv",
      "/contacts",
      "/en/contacts",
      "/blog",
      "/en/blog",
    ],
    // Runtime already accepts `minify`; current beta typings still lag behind.
    formatting: "minify" as never,
  },
}));
