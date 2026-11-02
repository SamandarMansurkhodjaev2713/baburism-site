import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { siteConfig } from "./site.config.mjs";

export default defineConfig({
  base: siteConfig.basePath,
  define: {
    __SITE_ORIGIN__: JSON.stringify(siteConfig.origin),
    __BUILD_YEAR__: JSON.stringify(siteConfig.buildYear),
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@content": fileURLToPath(new URL("./content", import.meta.url)),
    },
  },
  plugins: [reactRouter()],
});
