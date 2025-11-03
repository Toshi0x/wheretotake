import { test, expect } from '@playwright/test'
import fs from 'fs'

test('Crawl main pages and capture errors', async ({ page, baseURL }) => {
  const routes = ['/', '/london', '/plan']
  const logs: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') logs.push(`[console:${msg.type()}] ${msg.text()}`)
  })
  page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`))
  page.on('requestfailed', req => logs.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`))

  for (const r of routes) {
    await page.goto(r)
  }

  const out = ['# Error Report', '', ...logs.map(l => `- ${l}`)]
  if (!fs.existsSync('reports')) fs.mkdirSync('reports', { recursive: true })
  fs.writeFileSync('reports/errors.md', out.join('\n'))
  expect(true).toBeTruthy()
})

