import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: command === "build" || isPreview ? "/portfolio-site/" : "/", // GitHub Pages base path
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "scroll-motion": ["gsap", "gsap/ScrollTrigger", "lenis"],
          "ui-motion": ["framer-motion"],
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
}));
