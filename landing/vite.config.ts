import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/remix-of-archive-to-canvas/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
