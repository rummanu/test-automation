import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';

const envArg = process.env.ENV || "local";
let envFile = "credentials.env";
if (envArg === "stage") envFile = "credentials.stage.env";
else if (envArg === "test1") envFile = "credentials.test1.env";
else if (envArg === "test2") envFile = "credentials.test2.env";
dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  use: {
    baseURL: process.env.ADMIN_PANEL_WORKSPACE_BASE_URL || 'http://localhost:3000',
    httpCredentials:
      process.env.ADMIN_PANEL_WORKSPACE_ADMIN_EMAIL &&
        process.env.ADMIN_PANEL_WORKSPACE_ADMIN_PASSWORD
        ? {
          username: process.env.ADMIN_PANEL_WORKSPACE_ADMIN_EMAIL,
          password: process.env.ADMIN_PANEL_WORKSPACE_ADMIN_PASSWORD,
        }
        : undefined,
    trace: "on-first-retry",
    testIdAttribute: "data-test-element-id",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      slowMo: 0,
    },
  },

  projects: [
    {
      name: "setup",
      use: {
        headless: false,
        ...devices["Desktop Edge"], channel: 'msedge',
      },
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'Microsoft Edge',
      use: {
        headless: false,
        ...devices['Desktop Edge'], channel: 'msedge'
      },
      testIgnore: /.*\.setup\.ts/,
      dependencies: ["setup"],
    },
  ],
});
