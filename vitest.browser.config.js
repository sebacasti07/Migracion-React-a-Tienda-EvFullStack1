import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@testing-library/react",
      "react-router-dom",
      "vitest/browser"
    ]
  },
  test: {
    include: ["src/**/*.browser.test.{js,jsx}"],
    setupFiles: ["./src/test/setup.js"],
    browser: {
      enabled: true,
      provider: playwright({
        launch: {
          headless: true,
        },
      }),
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
  },
});