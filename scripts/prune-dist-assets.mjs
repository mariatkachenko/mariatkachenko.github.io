import { readdir, rm, stat } from 'node:fs/promises'
import { resolve, relative, sep } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const assetsRoot = resolve(projectRoot, 'dist', 'assets')

if (relative(projectRoot, assetsRoot) !== `dist${sep}assets`) {
  throw new Error(`Refusing to prune unexpected directory: ${assetsRoot}`)
}

const keepFiles = new Set([
  'grain/fonts/instrument-serif-italic.ttf',
  'grain/grain-texture-1440.webp',
  'maria/portrait-lossless.webp',
  'maria/theme-sun-lossless.webp',
  'maria/theme-moon-lossless.webp',
  'maria/theme-active-bg.svg',
  'maria/theme-sun.svg',
  'maria/theme-moon.svg',
  'maria/home-portrait-light-1280.webp',
  'maria/home-portrait-light-1920.webp',
  'maria/home-portrait-light-2560.webp',
  'maria/home-portrait-light-3840.webp',
  'maria/home-portrait-dark-1200.webp',
  'maria/home-portrait-dark-1800.webp',
  'maria/home-portrait-dark-2400.webp',
  'maria/home-card-works-640.webp',
  'maria/home-card-works-960.webp',
  'maria/home-card-works-1239.webp',
  'maria/home-card-about-640.webp',
  'maria/home-card-about-960.webp',
  'maria/home-card-about-1242.webp',
  'maria/works-vector-pattern.svg',
  'maria/project-file-icon.svg',
  'maria/works-phone-hand.webp',
  'maria/works-phone-hand-lock.webp',
  'maria/works-placeholder-payments-a.webp',
  'maria/mts-pay-card-composition-crisp.webp',
  'maria/mts-pay-logo-flyout.webp',
  'maria/mts-pay-butterfly-flyout.webp',
  'maria/rarible-ape.webp',
  'maria/rarible-charity-cover.webp',
  'maria/rarible-logo-hearts.webp',
  'maria/aliexpress-collections-cover.webp',
  'maria/aliexpress-bag.webp',
  'maria/aliexpress-heart.webp',
  'maria/aliexpress-sparkles.webp',
  'maria/mts-game-statue.webp',
  'maria/mts-game-girl.webp',
  'maria/mts-game-phones.webp',
  'maria/tinnotech-phones.webp',
  'maria/tinnotech-chat.webp',
  'maria/tinnotech-poll.webp',
  'maria/tinnotech-logo.webp',
  'maria/wallet-phones.webp',
  'maria/wallet-drink.webp',
  'maria/wallet-cart.webp',
  'maria/wallet-bottle.webp',
  'maria/autopay-phones.webp',
  'maria/autopay-arrows.webp',
  'maria/autopay-timer.webp',
  'maria/connection-phones.webp',
  'maria/sbp-phones.webp',
  'maria/about-space-pattern.svg',
  'maria/astronaut-optimized.glb',
])

const keepDirectories = [
  'maria/mts-presentation-webp/',
  'maria/mts-game-presentation/',
  'maria/rarible-presentation-numbered-webp/',
  'maria/aliexpress-presentation-numbered-webp/',
  'maria/sbp-presentation/',
  'maria/autopay-presentation/',
  'maria/connection-presentation/',
]

async function filesBelow(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = resolve(directory, entry.name)
    const name = `${prefix}${entry.name}`
    if (entry.isDirectory()) files.push(...await filesBelow(path, `${name}/`))
    else if (entry.isFile()) files.push({ path, name })
  }
  return files
}

let removedBytes = 0
let removedFiles = 0
for (const file of await filesBelow(assetsRoot)) {
  const viteBundle = /^index-[\w-]+\.(?:js|css)$/.test(file.name)
  const retained = viteBundle
    || keepFiles.has(file.name)
    || keepDirectories.some((directory) => file.name.startsWith(directory))
  if (retained) continue
  removedBytes += (await stat(file.path)).size
  removedFiles += 1
  await rm(file.path)
}

console.log(`Pruned ${removedFiles} inactive production assets (${(removedBytes / 1048576).toFixed(2)} MiB)`)
