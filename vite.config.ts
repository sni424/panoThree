import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ["jong-preview.ngrok.app", "jong-shader.ngrok.app"], // ngrok 도메인 허용
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // @ -> src
    },
  },
});
