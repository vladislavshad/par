import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3099",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run build && npx next start -p 3099",
    url: "http://localhost:3099",
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
