/** Trạng thái dùng chung phía client: dữ liệu vận hành, UTM, sự kiện đo lường. */

import { getBootstrap } from './api.js'

export const state = {
  bootstrap: null,
  bootstrapPromise: null,
  adminToken: null,
}

const TOKEN_KEY = 'vhub.admin.token'
const UTM_KEY = 'vhub.utm'

export function loadAdminToken() {
  try {
    state.adminToken = sessionStorage.getItem(TOKEN_KEY) || null
  } catch (_) {
    state.adminToken = null
  }
  return state.adminToken
}

export function setAdminToken(token) {
  state.adminToken = token
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch (_) {}
}

/** Tải dữ liệu vận hành (lịch live, số liệu, quỹ) — có cache trong phiên. */
export async function loadBootstrap(force = false) {
  if (state.bootstrap && !force) return state.bootstrap
  if (state.bootstrapPromise && !force) return state.bootstrapPromise
  state.bootstrapPromise = getBootstrap()
    .then((data) => {
      state.bootstrap = data
      return data
    })
    .finally(() => {
      state.bootstrapPromise = null
    })
  return state.bootstrapPromise
}

/** Bắt UTM từ URL một lần cho mỗi phiên, dùng khi gửi form. */
export function captureUtm() {
  try {
    const params = new URLSearchParams(location.search)
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    const found = {}
    keys.forEach((k) => {
      const v = params.get(k)
      if (v) found[k] = v.slice(0, 120)
    })
    if (params.get('ref')) found.utm_source = found.utm_source || params.get('ref').slice(0, 120)
    if (Object.keys(found).length) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(found))
      return found
    }
    const saved = sessionStorage.getItem(UTM_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (_) {
    return {}
  }
}

export function getUtm() {
  try {
    const saved = sessionStorage.getItem(UTM_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (_) {
    return {}
  }
}

export function sourcePage() {
  const hash = (location.hash || '#/').replace(/^#/, '')
  return hash.split('?')[0].slice(0, 180)
}

export function track(eventName, params = {}) {
  const payload = { event: eventName, ...params }
  try {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params)
    if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName, params)
    if (window.ttq && typeof window.ttq.track === 'function') window.ttq.track(eventName, params)
  } catch (_) {}
  return payload
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (_) {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (_) {}
}
