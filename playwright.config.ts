import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || 3000

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'iphone-14',
      use: { ...devices['iPhone 14'] }
    }
  ]
})

