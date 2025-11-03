import { test, expect } from '@playwright/test'

test('Planner page generates itineraries', async ({ page }) => {
  await page.goto('/plan')
  await page.getByLabel(/Budget Min/i).fill('15')
  await page.getByLabel(/Budget Max/i).fill('30')
  await page.getByRole('button', { name: 'Generate' }).click()
  const cards = page.locator('.card').filter({ hasText: 'hop' })
  const count = await cards.count()
  expect(count).toBeGreaterThan(0)
})

