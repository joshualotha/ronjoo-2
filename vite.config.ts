import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Dev must use "/" so styles and HMR load correctly; production build uses /build/ for Laravel public.
  base: mode === "development" ? "/" : "/build/",
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
