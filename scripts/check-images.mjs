#!/usr/bin/env node
/** Audit images across public pages, both languages and dynamically rendered cards. */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as home from '../src/pages/home.js'
import * as solutions from '../src/pages/solutions.js'
import * as studio from '../src/pages/studio.js'
import * as koc from '../src/pages/koc.js'
import * as chophien from '../src/pages/chophien.js'
import * as live from '../src/pages/live.js'
import * as academy from '../src/pages/academy.js'
import * as stories from '../src/pages/stories.js'
import * as contact from '../src/pages/contact.js'
import { headerMarkup, footerMarkup } from '../src/components/layout.js'
import { liveCard } from '../src/components/ui.js'
import { setLang } from '../src/lib/i18n.js'
import { STUDIOS } from '../src/lib/catalog-studios.js'
import { KOCS, AMBASSADORS } from '../src/lib/catalog-koc.js'
import { MARKETS } from '../src/lib/catalog-provinces.js'
import { SOLUTIONS, AUDIENCE_PAGES } from '../src/lib/catalog-solutions.js'
import { CASES, NEWS } from '../src/lib/catalog-cases.js'
import { COURSES, courseSlug } from '../src/lib/catalog-academy.js'
import { buildSeedLives } from '../src/lib/catalog-schedule.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const handlers = {
  '': home.render, 'giai-phap': solutions.render, studio: studio.render,
  kocviet: koc.render, 'cho-phien': chophien.render, 'lich-live': live.render,
  'hoc-vien': academy.render, 'du-an': stories.renderCases, 'tin-tuc': stories.renderNews,
  've-v-hub': stories.renderAbout, 'lien-he': contact.renderContact,
  'chinh-sach-bao-mat': contact.renderPrivacy, 'dieu-khoan': contact.renderTerms,
  'cam-on': contact.renderThanks,
}
const routes = new Set(Object.keys(handlers).map((key) => `/${key}`))
for (const [section, slugs] of [
  ['giai-phap', [...SOLUTIONS.map((s) => s.slug), ...Object.keys(AUDIENCE_PAGES)]],
  ['studio', STUDIOS.map((s) => s.slug)],
  ['kocviet', ['tim-kiem', 'dinh-danh', 'dai-su', 'affiliate', ...KOCS.map((k) => k.slug)]],
  ['cho-phien', ['minh-bach', ...MARKETS.map((m) => m.slug)]],
  ['hoc-vien', COURSES.map((c) => courseSlug(c.title))],
  ['du-an', CASES.map((c) => c.slug)], ['tin-tuc', NEWS.map((n) => n.slug)],
]) for (const slug of slugs) routes.add(`/${section}/${slug}`)

const errors = new Set()
const images = new Set()
const pendingImages = new Map()
let views = 0
function checkPath(src, context) {
  if (!src.startsWith('/') || src.startsWith('//')) return
  const clean = src.split(/[?#]/)[0]
  images.add(clean)
  if (!existsSync(join(root, clean.slice(1)))) errors.add(`${context}: missing ${clean}`)
}
function checkHtml(html, context) {
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/g)) {
    if (!match[1]) errors.add(`${context}: empty image source`)
    else checkPath(match[1], context)
  }
  for (const match of html.matchAll(/<figure\b([^>]*class="media\b[^"]*"[^>]*)>([\s\S]*?)<\/figure>/g)) {
    const pending = match[1].match(/data-image-pending="([^"]+)"/)
    if (!/<img\b/.test(match[2])) {
      if (!pending) errors.add(`${context}: media frame has no image or explicit pending description`)
      else if (context.endsWith('/vi')) {
        const pages = pendingImages.get(pending[1]) || new Set()
        pages.add(context.replace(/\/vi$/, ''))
        pendingImages.set(pending[1], pages)
      }
    }
  }
}
for (const lang of ['vi', 'en']) {
  setLang(lang)
  checkHtml(headerMarkup() + footerMarkup(), `layout/${lang}`)
  for (const path of routes) {
    const segments = path.slice(1).split('/').filter(Boolean)
    const page = handlers[segments[0] || '']({ segments, query: new URLSearchParams() })
    assert(page?.html, `Cannot render ${path}`)
    checkHtml(page.html, `${path}/${lang}`)
    views++
    if (path === '/kocviet/tim-kiem') {
      const nodes = new Map()
      page.mount({ querySelector(selector) {
        if (!nodes.has(selector)) nodes.set(selector, { value: '', innerHTML: '', addEventListener() {} })
        return nodes.get(selector)
      } })
      checkHtml(nodes.get('#koc-results').innerHTML, `creator results/${lang}`)
    }
  }
  for (const session of buildSeedLives()) checkHtml(liveCard(session), `live card/${lang}`)
  checkHtml(contact.render404().html, `404/${lang}`)
}
setLang('vi')
for (const ambassador of AMBASSADORS) {
  const creator = KOCS.find((k) => k.name === ambassador.name)
  assert(creator?.avatarSrc, `Missing creator portrait: ${ambassador.name}`)
  assert.equal(ambassador.imageSrc, creator?.avatarSrc, `Ambassador portrait mismatch: ${ambassador.name}`)
  for (const path of ['kocviet', 'kocviet/dai-su']) {
    const page = koc.render({ segments: path.split('/'), query: new URLSearchParams() })
    assert(page.html.includes(`src="${ambassador.imageSrc}"`), `Portrait not rendered: ${ambassador.name} on ${path}`)
  }
}
// Also catch unused or conditionally rendered literal image paths.
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) scan(path)
    else if (/\.(?:js|css)$/.test(entry.name)) {
      for (const match of readFileSync(path, 'utf8').matchAll(/\/images\/[\w./-]+\.(?:png|jpe?g|svg|webp|gif|avif)/g)) checkPath(match[0], path)
    }
  }
}
scan(join(root, 'src'))
scan(join(root, 'styles'))
if (errors.size) {
  for (const error of errors) console.error(`✗ ${error}`)
  process.exit(1)
}
if (process.argv.includes('--pending-json')) {
  console.log(JSON.stringify([...pendingImages].map(([description, pages]) => ({ description, pages: [...pages] })), null, 2))
} else {
  console.log(`• Images: ${routes.size} public routes × 2 languages (${views} views), ${images.size} local assets; no broken paths or unmarked empty frames.`)
  console.log(`• ${pendingImages.size} image/video descriptions intentionally pending; list with: node scripts/check-images.mjs --pending-json`)
}
