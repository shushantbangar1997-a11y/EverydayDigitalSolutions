import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * SSR-only Vite config.
 * Used exclusively by the build pipeline to produce dist/ssr/entry-server.js,
 * which is then consumed by build-scripts/prerender.mjs to render each route.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/ssr"),
    emptyOutDir: true,
    ssr: "src/entry-server.tsx",
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "entry-server.js",
      },
    },
  },
});
