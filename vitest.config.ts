import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests cover framework-independent modules, so the React Router plugin is not loaded here.
export default defineConfig({
  define: {
    __SITE_ORIGIN__: JSON.stringify("https://example.test"),
    __BUILD_YEAR__: JSON.stringify(2026),
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@content": fileURLToPath(new URL("./content", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
