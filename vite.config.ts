import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, isPreview, mode }) => ({
  base: (command === "build" || isPreview) ? (loadEnv(mode, ".", "PAGES_").PAGES_BASE_PATH || "/s-nsd/") : "/",
  plugins: [react()],
}));
