import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: 'tests',
  // global test timeout
  timeout: 3 * 60 * 1000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  // run tests with a single worker to avoid resource contention
  workers: 1,
  use: {
    headless: true,
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30 * 1000,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 180_000,
    cwd: path.join(__dirname),
  },
  projects: [
    // limit to chromium for now to speed up runs and reduce flakiness
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
