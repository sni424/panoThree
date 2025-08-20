import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    allowedHosts: ["jong-preview.ngrok.app", "jong-shader.ngrok.app"], // ngrok 도메인 허용
  },
});
