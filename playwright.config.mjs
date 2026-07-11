import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "security-reports/playwright-results",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: [
    ["line"],
    ["json", { outputFile: "security-reports/playwright-results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4175",
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "python3 -m http.server 4175 --bind 127.0.0.1",
    url: "http://127.0.0.1:4175/",
    reuseExistingServer: true,
    timeout: 10000,
  },
});
