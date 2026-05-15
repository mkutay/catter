import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Catter e2e tests.
 *
 * @note The web server is started before the tests begin, using `bun run start`.
 * Therefore, the codebase needs to be built before running the tests to ensure
 * the newest version of the code is being tested.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "bun run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
