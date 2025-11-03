import { test, expect } from '@playwright/test'

test('Collections deep links render cards', async ({ page }) => {
  await page.goto('/collections/under-40pp')
  await expect(page.locator('.card').first()).toBeVisible()
  await page.goto('/collections/soho-first-date')
  await expect(page.locator('.card').first()).toBeVisible()
})

