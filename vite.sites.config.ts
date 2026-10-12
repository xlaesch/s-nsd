import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Sites serves at the origin root; GitHub Pages retains its project base.
export default defineConfig({ base: "/", plugins: [react()] });
