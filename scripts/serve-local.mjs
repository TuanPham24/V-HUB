#!/usr/bin/env node
/* eslint-env node */
/* global process, console */
/**
 * Máy chủ tĩnh để xem giao diện cục bộ (không có API — API chạy trên Cloudflare Worker).
 * Chạy: npm start  → http://localhost:4173
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const root = process.cwd()
const port = Number(process.env.PORT || 4173)
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ics': 'text/calendar; charset=utf-8',
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'
    const filePath = normalize(join(root, pathname))
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    let target = filePath
    try {
      const st = await stat(target)
      if (st.isDirectory()) target = join(target, 'index.html')
    } catch (_) {
      target = join(root, 'index.html')
    }
    const body = await readFile(target)
    res.writeHead(200, {
      'Content-Type': MIME[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    res.end(body)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(`Lỗi máy chủ tĩnh: ${err.message}`)
  }
}).listen(port, () => {
  console.log(`V-HUB đang chạy tại http://localhost:${port}`)
  console.log('Lưu ý: máy chủ tĩnh chỉ phục vụ giao diện. Form/API cần Worker đã triển khai.')
})
