/**
 * Lịch live: sinh dữ liệu mẫu (11 phiên) + hàm suy ra trạng thái theo giờ Asia/Ho_Chi_Minh.
 * Múi giờ Việt Nam cố định UTC+7 (không có DST).
 */

export const VN_OFFSET_MS = 7 * 60 * 60 * 1000

export function vnParts(ms = Date.now()) {
  const d = new Date(ms + VN_OFFSET_MS)
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes(), weekday: d.getUTCDay() }
}

export function vnEpoch(year, month, day, hour = 0, minute = 0) {
  return Date.UTC(year, month - 1, day, hour, minute) - VN_OFFSET_MS
}

export function vnDateKey(ms = Date.now()) {
  const p = vnParts(ms)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** @typedef {{id:string, title:string, brand:string, platform:string, starts_at:number, duration_min:number, url:string|null, is_demo:number}} LiveSession */

const THEMES = [
  { title: 'Daily Live — Gia dụng thông minh', brand: 'Kim Long Home', platform: 'tiktok' },
  { title: 'Daily Live — Thời trang công sở', brand: 'Nhà Mây', platform: 'shopee' },
  { title: 'Daily Live — Đặc sản miền Tây', brand: 'Sông Tiền Foods', platform: 'facebook' },
  { title: 'Daily Live — Chăm sóc da mùa khô', brand: 'An Nhiên', platform: 'tiktok' },
  { title: 'Daily Live — Bếp Việt mỗi ngày', brand: 'Bếp Cô Tư', platform: 'shopee' },
  { title: 'Daily Live — Phụ kiện công nghệ', brand: 'TechOne', platform: 'youtube' },
  { title: 'Daily Live — Mẹ và bé', brand: 'An Nhiên', platform: 'tiktok' },
]

const SPECIALS = {
  3: { title: 'Megalive — Tuần lễ gia dụng', brand: 'Kim Long Home', platform: 'tiktok', hour: 19, minute: 30, duration: 210 },
  6: { title: 'Megalive — Đặc sản ba miền', brand: 'Sông Tiền Foods', platform: 'facebook', hour: 20, minute: 0, duration: 210 },
  9: { title: 'Super-Megalive — Chợ Phiên Phương Nam', brand: 'V-HUB', platform: 'vhub', hour: 20, minute: 0, duration: 240 },
}

/** Sinh 10 phiên theo lịch 10 ngày kể từ hôm nay + 1 phiên đang phát để minh hoạ. */
export function buildSeedLives(now = Date.now()) {
  const out = []
  const p = vnParts(now)
  out.push({
    id: 'demo-live-now',
    title: 'Megalive minh hoạ — Đặc sản miền Tây lên sóng',
    brand: 'V-HUB',
    platform: 'vhub',
    starts_at: now - 40 * 60 * 1000,
    duration_min: 240,
    url: null,
    is_demo: 1,
  })
  for (let i = 0; i < 10; i += 1) {
    const special = SPECIALS[i]
    const dayStart = vnEpoch(p.year, p.month, p.day) + i * 86400000
    const day = vnParts(dayStart)
    const theme = THEMES[i % THEMES.length]
    const start = special
      ? vnEpoch(day.year, day.month, day.day, special.hour, special.minute)
      : vnEpoch(day.year, day.month, day.day, 20, 0)
    out.push({
      id: `seed-live-${i}`,
      title: special ? special.title : theme.title,
      brand: special ? special.brand : theme.brand,
      platform: special ? special.platform : theme.platform,
      starts_at: start,
      duration_min: special ? special.duration : 120,
      url: null,
      is_demo: 1,
    })
  }
  return out
}

/** @returns {'upcoming'|'live'|'ended'} */
export function liveState(session, now = Date.now()) {
  if (session.status === 'cancelled') return 'cancelled'
  const start = Number(session.starts_at)
  const end = start + Number(session.duration_min || 120) * 60000
  if (now < start) return 'upcoming'
  if (now < end) return 'live'
  return 'ended'
}

export function liveEndsAt(session) {
  return Number(session.starts_at) + Number(session.duration_min || 120) * 60000
}

export function currentLive(sessions, now = Date.now()) {
  return (sessions || []).find((s) => liveState(s, now) === 'live') || null
}

export function upcomingLives(sessions, now = Date.now(), limit = 3) {
  return (sessions || [])
    .filter((s) => liveState(s, now) === 'upcoming')
    .sort((a, b) => a.starts_at - b.starts_at)
    .slice(0, limit)
}

/** 7 ngày của tuần hiện tại (từ hôm nay) theo giờ VN, kèm các phiên trong ngày. */
export function weekDays(sessions, now = Date.now(), days = 7) {
  const p = vnParts(now)
  const startOfToday = vnEpoch(p.year, p.month, p.day, 0, 0)
  const out = []
  for (let i = 0; i < days; i += 1) {
    const dayStart = startOfToday + i * 86400000
    const dayEnd = dayStart + 86400000
    const items = (sessions || [])
      .filter((s) => s.starts_at < dayEnd && liveEndsAt(s) > dayStart)
      .sort((a, b) => a.starts_at - b.starts_at)
    out.push({ key: vnDateKey(dayStart), dayStart, items, weekday: vnParts(dayStart).weekday, date: vnParts(dayStart) })
  }
  return out
}

/** Dựng file .ics cho một phiên live. */
export function buildIcs(session, now = Date.now()) {
  const start = Number(session.starts_at)
  const end = liveEndsAt(session)
  const fmt = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const title = `V-HUB · ${session.title}`
  const desc = `Phiên livestream ${session.brand || 'V-HUB'} trên nền tảng ${session.platform}. Xem lịch live tại vhub.vn.`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//V-HUB//Live Schedule//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${session.id}@vhub.vn`,
    `DTSTAMP:${fmt(now)}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${desc.replace(/\n/g, ' ')}`,
    'LOCATION:V-HUB — 232/14 Võ Thị Sáu, P. Xuân Hòa, TP.HCM',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
