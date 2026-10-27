/**
 * Nhúng GA4 / Meta Pixel / TikTok Pixel khi có cấu hình.
 * Các ID này là mã công khai (không phải secret nghiệp vụ); website vẫn chạy nếu thiếu.
 */

import { state } from './store.js'

let injected = false

function addScript(src, async = true) {
  const s = document.createElement('script')
  s.src = src
  s.async = async
  document.head.appendChild(s)
  return s
}

function injectGa4(id) {
  if (!id) return
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })
}

function injectMeta(id) {
  if (!id) return
  window.fbq =
    window.fbq ||
    function fbq() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)
    }
  if (!window._fbq) window._fbq = window.fbq
  window.fbq.push = window.fbq
  window.fbq.loaded = true
  window.fbq.version = '2.0'
  window.fbq.queue = []
  window.fbq('init', id)
  window.fbq('track', 'PageView')
  addScript('https://connect.facebook.net/en_US/fbevents.js')
}

function injectTikTok(id) {
  if (!id) return
  window.TiktokAnalyticsObject = 'ttq'
  const ttq = (window.ttq = window.ttq || [])
  ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']
  ttq.setAndDefer = function setAndDefer(target, method) {
    target[method] = function defer() {
      target.push([method].concat(Array.prototype.slice.call(arguments, 0)))
    }
  }
  for (const method of ttq.methods) ttq.setAndDefer(ttq, method)
  ttq.load = function load(pixelId) {
    addScript(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`)
    ttq._i = ttq._i || {}
    ttq._i[pixelId] = {}
    ttq._i[pixelId]._u = 'https://vhub.vn'
    ttq._t = ttq._t || {}
    ttq._t[pixelId] = +new Date()
    ttq._o = ttq._o || {}
    ttq._o[pixelId] = {}
  }
  ttq.load(id)
  ttq.page()
}

export function injectTracking() {
  if (injected) return
  injected = true
  const cfg = (state.bootstrap && state.bootstrap.tracking) || {}
  try {
    injectGa4(cfg.ga4)
    injectMeta(cfg.meta)
    injectTikTok(cfg.tiktok)
  } catch (err) {
    console.error('Tracking init failed', err)
  }
}
