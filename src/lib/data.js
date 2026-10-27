/** Ghép dữ liệu tĩnh (/content) với dữ liệu vận hành (API /api/bootstrap). */

import { state } from './store.js'
import { MARKETS, marketState, marketEndAt, fundTotals as contentFund } from '../lib/catalog-provinces.js'
import { buildSeedLives, liveState } from '../lib/catalog-schedule.js'
import { STUDIO_FACTS } from '../lib/catalog-studios.js'

export function bootstrap() {
  return state.bootstrap || null
}

/** Lịch live: ưu tiên dữ liệu vận hành, nếu chưa tải được thì dùng lịch mẫu. */
export function getLives() {
  const bs = bootstrap()
  if (bs && Array.isArray(bs.lives) && bs.lives.length) return bs.lives
  return buildSeedLives()
}

export function getCurrentLive() {
  return getLives().find((s) => liveState(s) === 'live') || null
}

/** Ghép mô tả tĩnh của tỉnh với số liệu vận hành trong DB. */
export function getMarkets() {
  const bs = bootstrap()
  const rows = (bs && Array.isArray(bs.markets) && bs.markets) || []
  return MARKETS.map((m) => {
    const row = rows.find((r) => r.id === m.id)
    if (!row) return { ...m, state: marketState(m) }
    return {
      ...m,
      heldAt: row.held_at ? new Date(Number(row.held_at)).toISOString() : m.heldAt,
      revenue: Number(row.revenue) || 0,
      donation: Number(row.donation) || 0,
      auction: Number(row.auction) || 0,
      orders: Number(row.orders) || 0,
      transferredAt: row.transferred_at || null,
      statementUrl: row.statement_url || null,
      minutesUrl: row.minutes_url || null,
      state: marketState({ ...m, heldAt: row.held_at ? new Date(Number(row.held_at)).toISOString() : m.heldAt }),
    }
  })
}

export function getNextMarket() {
  const list = getMarkets().slice().sort((a, b) => new Date(a.heldAt) - new Date(b.heldAt))
  return list.find((m) => marketEndAt(m) > Date.now()) || list[list.length - 1]
}

export function getFund() {
  const ended = getMarkets().filter((m) => m.season === 0)
  const rows = ended.map((m) => ({
    id: m.id,
    name: m.name,
    heldAt: m.heldAt,
    revenue: m.revenue,
    donation: m.donation,
    auction: m.auction,
    orders: m.orders,
    transferredAt: m.transferredAt,
    statementUrl: m.statementUrl,
    minutesUrl: m.minutesUrl,
  }))
  const total = rows.reduce((s, r) => s + r.donation + r.auction, 0)
  const fallback = contentFund()
  return {
    rows: rows.length ? rows : fallback.rows,
    total: rows.length ? total : fallback.total,
    donation: rows.reduce((s, r) => s + r.donation, 0) || fallback.donation,
    auction: rows.reduce((s, r) => s + r.auction, 0) || fallback.auction,
  }
}

/** Số liệu trang chủ — lấy từ bảng metrics trong DB, thiếu thì dùng giá trị mặc định có ghi chú. */
export function getStats() {
  const bs = bootstrap()
  const rows = (bs && Array.isArray(bs.stats) && bs.stats.items) || []
  const byKey = (k) => rows.find((r) => r.key === k)
  const fund = getFund()
  const studios = byKey('studios')
  const hours = byKey('live_hours')
  const kocs = byKey('koc_verified')
  const items = [
    { key: 'studios', value: studios ? Number(studios.value) : STUDIO_FACTS.totalFromMou, label: 'studio đang vận hành', display: '' },
    { key: 'live_hours', value: hours ? Number(hours.value) : 1280, label: 'giờ livestream đã phát', display: '' },
    { key: 'koc_verified', value: kocs ? Number(kocs.value) : 186, label: 'nhà sáng tạo đã định danh', display: '' },
    { key: 'fund', value: fund.total, label: 'đồng đã trao qua quỹ thiện nguyện', display: '' },
  ]
  const updatedAt =
    (bs && bs.stats && bs.stats.updatedAt) ||
    rows.reduce((max, r) => Math.max(max, Number(r.updated_at) || 0), 0) ||
    Date.now()
  return { items, updatedAt, isFallback: !rows.length }
}

export function findLive(id) {
  return getLives().find((s) => String(s.id) === String(id)) || null
}
