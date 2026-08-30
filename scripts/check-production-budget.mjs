import { readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const distRoot = resolve(import.meta.dirname, '..', 'dist')
const limits = {
  totalBytes: 21 * 1024 * 1024,
  javascriptBytes: 250 * 1024,
  stylesheetBytes: 92 * 1024,
  fileCount: 125,
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await filesBelow(path))
    else if (entry.isFile()) files.push({ path, size: (await stat(path)).size })
  }
  return files
}

const files = await filesBelow(distRoot)
const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
const largestJavaScript = Math.max(0, ...files.filter((file) => file.path.endsWith('.js')).map((file) => file.size))
const largestStylesheet = Math.max(0, ...files.filter((file) => file.path.endsWith('.css')).map((file) => file.size))
const failures = [
  totalBytes > limits.totalBytes && `total ${(totalBytes / 1048576).toFixed(2)} MiB > 21 MiB`,
  largestJavaScript > limits.javascriptBytes && `JavaScript ${(largestJavaScript / 1024).toFixed(1)} KiB > 250 KiB`,
  largestStylesheet > limits.stylesheetBytes && `CSS ${(largestStylesheet / 1024).toFixed(1)} KiB > 92 KiB`,
  files.length > limits.fileCount && `files ${files.length} > ${limits.fileCount}`,
].filter(Boolean)

if (failures.length) throw new Error(`Production budget exceeded: ${failures.join('; ')}`)
console.log(`Production budget passed: ${(totalBytes / 1048576).toFixed(2)} MiB, ${files.length} files`)
