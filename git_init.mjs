// Scratch script: initialise git repo and make first commit using isomorphic-git
import git from 'isomorphic-git'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = 'D:/Portfolio'

// Files / patterns to ignore when staging
const IGNORE = new Set(['node_modules', 'dist', '.git'])

async function walk(base, rel = '') {
  const entries = fs.readdirSync(path.join(base, rel))
  let files = []
  for (const e of entries) {
    if (IGNORE.has(e)) continue
    const relPath = rel ? `${rel}/${e}` : e
    const full = path.join(base, relPath)
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(await walk(base, relPath))
    } else {
      files.push(relPath)
    }
  }
  return files
}

await git.init({ fs, dir, defaultBranch: 'main' })

// Configure author
const author = { name: 'sreenath', email: 'sreenathsree842@gmail.com' }

const files = await walk(dir)
console.log(`Staging ${files.length} files...`)

for (const f of files) {
  await git.add({ fs, dir, filepath: f })
}

const sha = await git.commit({
  fs,
  dir,
  message: 'Initial project setup',
  author,
})

console.log('Committed:', sha)
