const fs = require('fs')
const path = require('path')

function findRoutes(appDir) {
  const routes = []
  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), path.join(prefix, entry.name))
      } else if (/page\.(t|j)sx?$/.test(entry.name)) {
        const rel = path.join(prefix, entry.name)
        const route = '/' + prefix.replace(/\\/g,'/').replace(/\\page\.(t|j)sx?$/, '').replace(/\/page\.(t|j)sx?$/, '')
        routes.push({ route: route.replace(/\/$/, '') || '/', file: path.join(prefix, entry.name) })
      }
    }
  }
  walk(appDir)
  return routes
}

function listComponents(dir) {
  const files = []
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (/(components|ui)[\\\/].*\.(t|j)sx$/.test(p)) files.push(p)
    }
  }
  walk(dir)
  return files
}

function writeRoutesMd(routes) {
  const lines = ['# Route Inventory', '']
  for (const r of routes.sort((a,b)=>a.route.localeCompare(b.route))) {
    lines.push(`- ${r.route}  (${r.file})`)
  }
  ensureDir('reports')
  fs.writeFileSync('reports/routes.md', lines.join('\n'))
}

function writeComponentsMd(components) {
  const lines = ['# Component Inventory', '', 'Key components and files:']
  for (const c of components.sort()) lines.push(`- ${c}`)
  ensureDir('reports')
  fs.writeFileSync('reports/components.md', lines.join('\n'))
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) }

const routes = findRoutes(path.join(process.cwd(), 'app'))
writeRoutesMd(routes)
const comps = listComponents(path.join(process.cwd()))
writeComponentsMd(comps)
console.log('Wrote reports/routes.md and reports/components.md')

