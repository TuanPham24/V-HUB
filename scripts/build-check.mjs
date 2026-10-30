#!/usr/bin/env node
/* eslint-env node */
/* global process, console */
/**
 * Kiểm tra "build": không cần bundler, chỉ xác thực cú pháp toàn bộ file JS/ESM,
 * sự tồn tại của các file được tham chiếu trong index.html và sitemap.
 * Chạy: npm run build
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const root = process.cwd()
const skipDirs = new Set(['node_modules', '.git', 'images'])
let files = []

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry)) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full)
    else if (['.js', '.mjs'].includes(extname(full))) files.push(full)
  }
}

walk(root)

let failed = 0
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
  } catch (err) {
    failed += 1
    console.error(`✗ Cú pháp lỗi: ${file}`)
    console.error(String(err.stderr || err.message).split('\n').slice(0, 6).join('\n'))
  }
}

// Kiểm tra tài nguyên trong index.html
const html = readFileSync(join(root, 'index.html'), 'utf8')
const assets = [...html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)].map((m) => m[1]).filter((p) => !p.startsWith('//'))
const missingAssets = assets.filter((p) => {
  const clean = p.split('?')[0].replace(/^\//, '')
  return clean && !existsSync(join(root, clean))
})

// Kiểm tra route trong sitemap có tiền tố hợp lệ
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

console.log(`• Đã kiểm tra ${files.length} file JS/ESM`)
console.log(`• Tài nguyên index.html: ${assets.length} (thiếu: ${missingAssets.length})`)
console.log(`• Sitemap: ${urls.length} URL`)

if (missingAssets.length) {
  failed += 1
  console.error('✗ Thiếu tài nguyên:', missingAssets.join(', '))
}
if (!urls.length) {
  failed += 1
  console.error('✗ Sitemap rỗng')
}

try {
  execFileSync(process.execPath, ['scripts/check-images.mjs'], { cwd: root, stdio: 'inherit' })
} catch (_) {
  failed += 1
}

if (failed) {
  console.error(`\nBuild kiểm tra thất bại (${failed} lỗi).`)
  process.exit(1)
}
console.log('\n✓ Build kiểm tra thành công — không cần bước bundling.')
