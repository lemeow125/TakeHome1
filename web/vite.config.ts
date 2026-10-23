// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",      // <-- this is the line that's being ignored
    setupFiles: ["./src/mocks/setup.tsx"],
    globals: true,
  },
});