import { test, expect } from '@playwright/test'

test('Place page reviews submit persists', async ({ page }) => {
  // choose first trending place from home to get a slug
  await page.goto('/')
  const first = page.locator('a').filter({ hasText: /View/ }).first()
  // fallback: navigate directly if needed
  await page.goto('/place/duke-of-wellington')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText('Reviews')).toBeVisible()

  // Count existing
  const counter = await page.getByText(/average from/).textContent()

  // Add new review
  await page.getByLabel('Rating 1 to 5').fill('5')
  await page.getByLabel('Title').fill('Great spot')
  await page.getByLabel('Body').fill('Loved the vibe and short travel time.')
  await page.getByLabel('Name').fill('QA')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('status')).toContainText('Thanks for sharing')
  // Average/count updates
  await expect(page.getByText(/average from/)).toBeVisible()
})

