import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('Home → Deal me 3 → Action', async ({ page }) => {
  await page.goto('/')
  // date defaults to +14d, ensure present
  const dateInput = page.getByLabel('Date')
  await expect(dateInput).toBeVisible()
  await page.getByRole('button', { name: 'Deal me 3' }).click()

  // Modal opens and shows at least 1 step
  const steps = page.locator('[role="dialog"] ol li')
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  const count = await steps.count()
  expect(count).toBeGreaterThan(0)

  // Each step shows hop text
  await expect(page.locator('[role="dialog"]')).toContainText('hop')

  // Copy plan toast
  await page.getByRole('button', { name: 'Copy plan' }).click()
  await expect(page.getByRole('status')).toContainText('Plan copied')

  // Close with Esc restores focus
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Deal me 3' })).toBeFocused()
})

test('Accessibility @axe', async ({ page }) => {
  await page.goto('/')
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  expect(accessibilityScanResults.violations).toEqual([])
})
