// node repro.mjs rename    -> rename `Page` to `RenamedPage`, count evaluations of Page.jsx for 5 s
// node repro.mjs hot-data  -> `import.meta.webpackHot.data ??= {}` in Page.jsx, then edit its text
import { readFileSync, writeFileSync } from 'node:fs'
import { createRsbuild } from '@rsbuild/core'
import { chromium } from 'playwright'
import config from './rsbuild.config.mjs'

const scenario = process.argv[2] ?? 'rename'
const file = new URL('./src/Page.jsx', import.meta.url)
const original = readFileSync(file, 'utf8')
const prefix = 'import.meta.webpackHot.data ??= {}\n'
if (scenario === 'hot-data') {
  writeFileSync(file, prefix + original)
}

const rsbuild = await createRsbuild({ cwd: process.cwd(), rsbuildConfig: config })
const { server } = await rsbuild.startDevServer()
let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
  const page = await browser.newPage()
  let evals = 0
  page.on('console', (m) => {
    if (m.text().includes('[eval] Page.jsx')) {
      evals++
    }
  })
  await page.goto('http://localhost:4173/')
  await page.waitForSelector('#page')
  if (scenario === 'rename') {
    const before = evals
    writeFileSync(file, original.replace('const Page =', 'const RenamedPage =').replace('export default Page', 'export default RenamedPage'))
    await page.waitForTimeout(5000)
    console.log('evaluations of Page.jsx in the 5 s after the rename:', evals - before)
  } else {
    writeFileSync(file, (prefix + original).replace('>page<', '>edited<'))
    const shown = await page
      .waitForFunction(() => document.querySelector('#page')?.textContent === 'edited', null, { timeout: 5000 })
      .then(() => true, () => false)
    console.log(shown ? 'edit shown' : 'edit NOT shown (and no reload)')
  }
} finally {
  writeFileSync(file, original)
  await browser?.close()
  await server.close()
}
