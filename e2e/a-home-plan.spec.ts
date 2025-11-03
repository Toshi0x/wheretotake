import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('Home → Deal me 3 → Action', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Budget Min').fill('15')
  await page.getByLabel('Budget Max').fill('30')
  // date defaults to +14d, ensure present
  const dateInput = page.getByLabel('Date')
  await expect(dateInput).toBeVisible()
  await page.getByRole('button', { name: 'Deal me 3' }).click()

  // Modal opens and shows 1–3 steps
  const steps = page.locator('[role="dialog"] ol li')
  await expect(steps).toHaveCountGreaterThan(0)

  // Each step shows name, area, and travel
  await expect(page.locator('[role="dialog"]')).toContainText('hop')

  // Copy plan → toast
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

