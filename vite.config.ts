import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://192.168.29.34:2020 ",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
