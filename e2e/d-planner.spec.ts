import { test, expect } from '@playwright/test'

test('Planner page generates itineraries', async ({ page }) => {
  await page.goto('/plan')
  await page.getByLabel('Budget Min (£)').fill('15')
  await page.getByLabel('Budget Max (£)').fill('30')
  await page.getByRole('button', { name: 'Generate' }).click()
  const cards = page.locator('.card').filter({ hasText: 'hop' })
  await expect(cards).toHaveCountGreaterThan(0)
})

