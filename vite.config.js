import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Node environment only
const tailwindConfig = require('./tailwind.config.js');


export default async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
  ];

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
  ) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return defineConfig({
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(new URL('.', import.meta.url).pathname, "client", "src"),
        "@shared": path.resolve(new URL('.', import.meta.url).pathname, "shared"),
        "@assets": path.resolve(new URL('.', import.meta.url).pathname, "attached_assets"),
      },
    },
    root: path.resolve(new URL('.', import.meta.url).pathname, "client"),
    build: {
      outDir: path.resolve(new URL('.', import.meta.url).pathname, "dist/public"),
      emptyOutDir: true,
    },
  });
};
