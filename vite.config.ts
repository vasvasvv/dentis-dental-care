import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "lucide-react"],
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? "";
          // Фіксовані назви для логотипів (LCP preload)
          if (name.includes("Dentis_with_Text") && !name.includes("g.")) {
            return "assets/logo-white.webp";
          }
          if (name.includes("Dentis_with_Textg")) {
            return "assets/logo-gold.webp";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
  },
}));
