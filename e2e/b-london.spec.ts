import { test, expect } from '@playwright/test'

test('London browse & sticky filters', async ({ page }) => {
  await page.goto('/london?min=10&max=25&vibes=low_key&lead=14')
  const cards = page.locator('.card').filter({ hasText: 'View' })
  await expect(cards).toHaveCountGreaterThan(0)
  await page.reload()
  await expect(page).toHaveURL(/min=10/)

  // Change filters
  await page.getByPlaceholder('Min £').fill('12')
  await page.getByPlaceholder('Max £').fill('30')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page).toHaveURL(/min=12/)
})

