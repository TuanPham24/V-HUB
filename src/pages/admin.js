/** Trang quản trị: đăng nhập, lead, đặt lịch, lịch live, số liệu, Chợ Phiên & quỹ. */

import { esc, $$ } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { formatCurrency, formatDateTime } from '../lib/format.js'
import { adminGet, adminPatch, adminPut, adminPost, adminDelete, adminExportCsv, adminLogin, adminLogout } from '../lib/api.js'
import { loadAdminToken, setAdminToken, state } from '../lib/store.js'
import { toast } from '../components/ui.js'

const LEAD_STATUS = [
  { id: 'new', label: 'Mới' },
  { id: 'contacted', label: 'Đã liên hệ' },
  { id: 'qualified', label: 'Đủ điều kiện' },
  { id: 'won', label: 'Đã chốt' },
  { id: 'closed', label: 'Đóng' },
]

const BOOKING_STATUS = [
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'done', label: 'Đã hoàn tất' },
  { id: 'cancelled', label: 'Đã huỷ' },
]

const TYPE_LABEL = {
  lead: 'Lead',
  'booking-koc': 'Booking KOC',
  newsletter: 'Nhận tin',
}

function loginView() {
  return `<div class="container admin-shell">
    <div class="admin-login">
      <span class="kicker">${tr('Quản trị', 'Admin')}</span>
      <h1 style="font-size:var(--fs-h2)">${tr('Đăng nhập quản trị', 'Admin sign in')}</h1>
      <p class="small muted">${tr('Khu vực dành cho đội vận hành V-HUB. Mật khẩu được cấu hình trong biến môi trường ADMIN_PASSWORD.', 'Operations area. The password is configured in the ADMIN_PASSWORD secret.')}</p>
      <form id="admin-login-form" class="stack" novalidate>
        <div class="field"><label for="admin-password">${tr('Mật khẩu', 'Password')}</label><input class="input" type="password" id="admin-password" autocomplete="current-password" required /></div>
        <div class="form-status" id="admin-login-status" role="alert"></div>
        <button class="btn btn--block" type="submit">${tr('Đăng nhập', 'Sign in')}</button>
      </form>
      <p class="form-note">${tr('Phiên đăng nhập hết hạn sau 8 giờ. Không chia sẻ mật khẩu.', 'Sessions expire after 8 hours. Do not share the password.')}</p>
    </div>
  </div>`
}

function shellView() {
  return `<div class="container admin-shell">
    <div class="row row--between" style="margin-bottom:var(--sp-4)">
      <div><span class="kicker">${tr('Quản trị', 'Admin')}</span><h1 style="font-size:var(--fs-h2)">V-HUB Console</h1></div>
      <div class="row" style="gap:8px"><button class="btn btn--ghost btn--sm" type="button" id="admin-refresh">${icon('rotate', 'btn__icon')}<span>${tr('Tải lại', 'Refresh')}</span></button><button class="btn btn--ghost btn--sm" type="button" id="admin-logout">${icon('logout', 'btn__icon')}<span>${tr('Đăng xuất', 'Sign out')}</span></button></div>
    </div>
    <div class="admin-tabs" role="tablist" aria-label="${tr('Khu vực quản trị', 'Admin sections')}">
      <button class="tab is-active" type="button" role="tab" aria-selected="true" data-admin-tab="leads">${tr('Lead', 'Leads')}</button>
      <button class="tab" type="button" role="tab" aria-selected="false" data-admin-tab="bookings">${tr('Đặt lịch', 'Bookings')}</button>
      <button class="tab" type="button" role="tab" aria-selected="false" data-admin-tab="lives">${tr('Lịch live', 'Live schedule')}</button>
      <button class="tab" type="button" role="tab" aria-selected="false" data-admin-tab="metrics">${tr('Số liệu', 'Metrics')}</button>
      <button class="tab" type="button" role="tab" aria-selected="false" data-admin-tab="markets">${tr('Chợ Phiên & quỹ', 'Markets & fund')}</button>
    </div>
    <div id="admin-content"><div class="skeleton" style="height:220px"></div></div>
  </div>`
}

function statusSelect(current, list, id, kind) {
  return `<select class="mini-select" data-status-kind="${kind}" data-id="${esc(id)}" aria-label="${tr('Đổi trạng thái', 'Change status')}">
    ${list.map((s) => `<option value="${s.id}" ${s.id === current ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}
  </select>`
}

function leadsTable(leads) {
  if (!leads.length) return `<div class="empty-state"><strong>${tr('Chưa có lead nào', 'No leads yet')}</strong><p>${tr('Lead từ form, chat và booking KOC sẽ xuất hiện ở đây.', 'Leads from forms, chat and creator bookings appear here.')}</p></div>`
  return `<div class="table-wrap"><table class="data admin-table">
    <thead><tr><th>${tr('Thời gian', 'Time')}</th><th>${tr('Họ tên', 'Name')}</th><th>${tr('Liên hệ', 'Contact')}</th><th>${tr('Loại', 'Type')}</th><th>${tr('Nhu cầu', 'Needs')}</th><th>${tr('Nguồn', 'Source')}</th><th>${tr('Trạng thái', 'Status')}</th></tr></thead>
    <tbody>${leads
      .map(
        (l) => `<tr>
          <td class="xsmall">${formatDateTime(l.created_at)}</td>
          <td><strong>${esc(l.name || '—')}</strong><div class="xsmall">${esc(l.company || '')}</div></td>
          <td class="xsmall">${esc(l.phone || '—')}<br />${esc(l.email || '')}</td>
          <td><span class="badge">${esc(TYPE_LABEL[l.type] || l.type)}</span></td>
          <td class="xsmall" style="max-width:260px">${esc(l.needs || l.message || '')}<div class="xsmall muted">${esc(l.audience || '')}${l.budget ? ` · ${esc(l.budget)}` : ''}${l.province ? ` · ${esc(l.province)}` : ''}</div></td>
          <td class="xsmall">${esc(l.source_page || '')}<div class="xsmall muted">${esc(l.utm_source || '')}</div></td>
          <td>${statusSelect(l.status, LEAD_STATUS, l.id, 'lead')}</td>
        </tr>`,
      )
      .join('')}</tbody></table></div>`
}

function bookingsTable(rows) {
  if (!rows.length) return `<div class="empty-state"><strong>${tr('Chưa có đặt lịch nào', 'No bookings yet')}</strong><p>${tr('Đặt lịch studio sẽ xuất hiện ở đây kèm mã đặt chỗ.', 'Studio bookings appear here with their code.')}</p></div>`
  return `<div class="table-wrap"><table class="data admin-table">
    <thead><tr><th>${tr('Mã', 'Code')}</th><th>${tr('Studio', 'Studio')}</th><th>${tr('Ngày & ca', 'Date & slot')}</th><th>${tr('Khách', 'Customer')}</th><th>${tr('Ước tính', 'Estimate')}</th><th>${tr('Trạng thái', 'Status')}</th></tr></thead>
    <tbody>${rows
      .map(
        (b) => `<tr>
          <td><strong style="font-family:var(--font-heading)">${esc(b.code)}</strong><div class="xsmall muted">${formatDateTime(b.created_at)}</div></td>
          <td>${esc(b.studio_id)}</td>
          <td>${esc(b.date)}<div class="xsmall muted">${esc(b.slot)} · ${b.hours}${tr('giờ', 'h')}</div></td>
          <td>${esc(b.name)}<div class="xsmall muted">${esc(b.phone)}</div></td>
          <td class="num">${formatCurrency(b.estimate)}</td>
          <td>${statusSelect(b.status, BOOKING_STATUS, b.id, 'booking')}</td>
        </tr>`,
      )
      .join('')}</tbody></table></div>`
}

function livesTable(lives) {
  return `<div class="card" style="gap:12px">
    <div class="row row--between"><h2 style="font-size:1.125rem">${tr('Lịch live đang hiển thị', 'Current live schedule')}</h2><button class="btn btn--sm" type="button" data-live-new>${icon('plus', 'btn__icon')}<span>${tr('Thêm phiên', 'Add session')}</span></button></div>
    <div id="live-form-slot"></div>
    <div class="table-wrap"><table class="data admin-table">
      <thead><tr><th>${tr('Tiêu đề', 'Title')}</th><th>${tr('Nhãn hàng', 'Brand')}</th><th>${tr('Bắt đầu', 'Starts')}</th><th>${tr('Phút', 'Minutes')}</th><th>${tr('Nền tảng', 'Platform')}</th><th></th></tr></thead>
      <tbody>${lives
        .map(
          (l) => `<tr>
            <td><input class="mini-select" style="min-width:220px" data-live-field="title" data-id="${esc(l.id)}" value="${esc(l.title)}" /></td>
            <td><input class="mini-select" style="min-width:120px" data-live-field="brand" data-id="${esc(l.id)}" value="${esc(l.brand || '')}" /></td>
            <td><input class="mini-select" type="datetime-local" data-live-field="starts_at" data-id="${esc(l.id)}" value="${esc(toLocal(l.starts_at))}" /></td>
            <td><input class="mini-select" type="number" min="15" step="15" style="width:80px" data-live-field="duration_min" data-id="${esc(l.id)}" value="${Number(l.duration_min) || 120}" /></td>
            <td><select class="mini-select" data-live-field="platform" data-id="${esc(l.id)}">${['tiktok', 'shopee', 'facebook', 'youtube', 'vhub'].map((p) => `<option value="${p}" ${p === l.platform ? 'selected' : ''}>${p}</option>`).join('')}</select></td>
            <td><div class="admin-actions"><button class="btn btn--sm" type="button" data-live-save="${esc(l.id)}">${tr('Lưu', 'Save')}</button><button class="btn btn--ghost btn--sm" type="button" data-live-delete="${esc(l.id)}" aria-label="${tr('Xoá phiên', 'Delete session')}">${icon('trash')}</button></div></td>
          </tr>`,
        )
        .join('')}</tbody></table></div>
    <p class="form-note">${tr('Giờ nhập theo múi giờ Việt Nam (UTC+7). Huy hiệu LIVE tự tính từ thời gian bắt đầu và thời lượng.', 'Times are Vietnam time (UTC+7). The LIVE badge is derived from start time and duration.')}</p>
  </div>`
}

function metricsView(metrics) {
  const labels = { studios: 'Studio đang vận hành', live_hours: 'Giờ livestream đã phát', koc_verified: 'Nhà sáng tạo đã định danh' }
  return `<div class="card" style="gap:12px">
    <h2 style="font-size:1.125rem">${tr('Bộ đếm số liệu trang chủ', 'Homepage counters')}</h2>
    <div class="grid grid--3">
      ${metrics
        .map(
          (m) => `<div class="field"><label for="metric-${esc(m.key)}">${esc(labels[m.key] || m.key)}</label><input class="input" id="metric-${esc(m.key)}" type="number" min="0" data-metric="${esc(m.key)}" value="${Number(m.value) || 0}" /></div>`,
        )
        .join('')}
    </div>
    <p class="form-note">${tr('Quỹ thiện nguyện tự cộng dồn từ bảng Chợ Phiên, không nhập tay. Ngày cập nhật hiển thị tự động.', 'The charity fund is summed from the markets table automatically. The updated date is derived.')}</p>
    <div class="row"><button class="btn" type="button" data-save-metrics>${tr('Lưu số liệu', 'Save metrics')}</button></div>
  </div>`
}

function marketsView(markets) {
  return `<div class="card" style="gap:12px">
    <h2 style="font-size:1.125rem">${tr('Phiên Chợ Phiên & quỹ', 'Market sessions & fund')}</h2>
    <div class="table-wrap"><table class="data admin-table">
      <thead><tr><th>${tr('Tỉnh', 'Province')}</th><th>${tr('Ngày', 'Date')}</th><th>${tr('Doanh thu', 'Revenue')}</th><th>${tr('Trích quỹ', 'Fund')}</th><th>${tr('Đấu giá', 'Auction')}</th><th>${tr('Đơn', 'Orders')}</th><th>${tr('Sao kê', 'Statement')}</th><th>${tr('Biên bản', 'Minutes')}</th></tr></thead>
      <tbody>${markets
        .map(
          (m) => `<tr data-market-row="${esc(m.id)}">
            <td><strong>${esc(m.name)}</strong><div class="xsmall muted">${esc(m.id)}</div></td>
            <td>${esc(String(m.held_at).slice(0, 10))}</td>
            <td><input class="mini-select" type="number" min="0" step="1000" style="width:130px" data-market-field="revenue" value="${Number(m.revenue) || 0}" /></td>
            <td><input class="mini-select" type="number" min="0" step="1000" style="width:120px" data-market-field="donation" value="${Number(m.donation) || 0}" /></td>
            <td><input class="mini-select" type="number" min="0" step="1000" style="width:110px" data-market-field="auction" value="${Number(m.auction) || 0}" /></td>
            <td><input class="mini-select" type="number" min="0" style="width:80px" data-market-field="orders" value="${Number(m.orders) || 0}" /></td>
            <td><input class="mini-select" style="min-width:150px" data-market-field="statement_url" value="${esc(m.statement_url || '')}" placeholder="https://" /></td>
            <td><input class="mini-select" style="min-width:150px" data-market-field="minutes_url" value="${esc(m.minutes_url || '')}" placeholder="https://" /></td>
          </tr>`,
        )
        .join('')}</tbody></table></div>
    <p class="form-note">${tr('Nhập doanh thu thực thu sau hoàn hàng. Khoản trích quỹ nên bằng 10% doanh thu; hệ thống không tự tính để giữ số liệu đã công bố.', 'Enter net revenue after returns. The fund amount should be 10% of revenue; it is not auto-calculated to preserve published figures.')}</p>
    <div class="row"><button class="btn" type="button" data-save-markets>${tr('Lưu bảng quỹ', 'Save fund table')}</button></div>
  </div>`
}

function toLocal(ms) {
  const d = new Date(Number(ms) + 7 * 3600 * 1000)
  return d.toISOString().slice(0, 16)
}

function fromLocal(value) {
  if (!value) return 0
  const ms = new Date(`${value}:00+07:00`).getTime()
  return Number.isFinite(ms) ? ms : 0
}

function renderContent(root, data, tab) {
  const host = root.querySelector('#admin-content')
  if (!host) return
  if (tab === 'leads') host.innerHTML = `<div class="row row--between" style="margin-bottom:12px"><p class="small muted">${data.leads.length} ${tr('lead', 'leads')}</p><button class="btn btn--ghost btn--sm" type="button" id="export-csv">${icon('download', 'btn__icon')}<span>${tr('Xuất CSV', 'Export CSV')}</span></button></div>${leadsTable(data.leads)}`
  else if (tab === 'bookings') host.innerHTML = `<div class="row row--between" style="margin-bottom:12px"><p class="small muted">${data.bookings.length} ${tr('đặt lịch', 'bookings')}</p></div>${bookingsTable(data.bookings)}`
  else if (tab === 'lives') host.innerHTML = livesTable(data.lives)
  else if (tab === 'metrics') host.innerHTML = metricsView(data.metrics)
  else host.innerHTML = marketsView(data.markets)
}

async function loadOverview(root, tab) {
  const host = root.querySelector('#admin-content')
  if (host) host.innerHTML = `<div class="skeleton" style="height:220px"></div>`
  try {
    const data = await adminGet('/api/admin/overview', state.adminToken)
    root._data = data
    renderContent(root, data, tab)
  } catch (err) {
    if (err.status === 401) {
      setAdminToken(null)
      root.innerHTML = loginView()
      mountLogin(root)
      toast(tr('Phiên đăng nhập đã hết hạn.', 'Session expired.'), 'error')
      return
    }
    if (host) host.innerHTML = `<div class="form-status is-error" style="display:block">${esc(err.message)} <button class="btn btn--link btn--sm" type="button" data-retry-admin>${tr('Thử lại', 'Retry')}</button></div>`
  }
}

function openLiveForm(root, session) {
  const slot = root.querySelector('#live-form-slot')
  if (!slot) return
  slot.innerHTML = `<div class="card" style="gap:10px;background:var(--surface-alt)">
    <h3 style="font-size:1rem">${session ? tr('Sửa phiên live', 'Edit session') : tr('Thêm phiên live', 'Add session')}</h3>
    <div class="field-grid field-grid--2">
      <div class="field"><label for="lf-title">${tr('Tiêu đề', 'Title')}</label><input class="input" id="lf-title" value="${esc(session?.title || '')}" /></div>
      <div class="field"><label for="lf-brand">${tr('Nhãn hàng', 'Brand')}</label><input class="input" id="lf-brand" value="${esc(session?.brand || '')}" /></div>
      <div class="field"><label for="lf-start">${tr('Bắt đầu (giờ VN)', 'Start (VN time)')}</label><input class="input" type="datetime-local" id="lf-start" value="${esc(toLocal(session?.starts_at || Date.now()))}" /></div>
      <div class="field"><label for="lf-duration">${tr('Thời lượng (phút)', 'Duration (minutes)')}</label><input class="input" type="number" id="lf-duration" min="15" step="15" value="${Number(session?.duration_min) || 120}" /></div>
      <div class="field"><label for="lf-platform">${tr('Nền tảng', 'Platform')}</label><select class="select" id="lf-platform">${['tiktok', 'shopee', 'facebook', 'youtube', 'vhub'].map((p) => `<option value="${p}" ${p === session?.platform ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
      <div class="field"><label for="lf-url">${tr('Link phát (không bắt buộc)', 'Watch URL (optional)')}</label><input class="input" id="lf-url" value="${esc(session?.url || '')}" placeholder="https://" /></div>
    </div>
    <div class="row" style="gap:8px"><button class="btn btn--sm" type="button" data-save-live-new="${esc(session?.id || '')}">${tr('Lưu phiên', 'Save session')}</button><button class="btn btn--ghost btn--sm" type="button" data-cancel-live>${tr('Huỷ', 'Cancel')}</button></div>
  </div>`
}

async function refresh(root) {
  const tab = root.querySelector('[data-admin-tab].is-active')?.dataset.adminTab || 'leads'
  await loadOverview(root, tab)
}

export function render() {
  return {
    title: 'Quản trị — V-HUB',
    description: 'Khu vực quản trị V-HUB: lead, đặt lịch studio, lịch live, số liệu và quỹ Chợ Phiên.',
    html: `<main id="main">${loadAdminToken() ? shellView() : loginView()}</main>`,
    mount(root) {
      if (!state.adminToken) {
        mountLogin(root)
        return
      }
      mountShell(root)
    },
  }
}

function mountLogin(root) {
  const form = root.querySelector('#admin-login-form')
  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const status = root.querySelector('#admin-login-status')
    const input = root.querySelector('#admin-password')
    const btn = form.querySelector('button[type="submit"]')
    if (btn) btn.disabled = true
    try {
      const res = await adminLogin(input.value)
      setAdminToken(res.token)
      toast(tr('Đăng nhập thành công.', 'Signed in.'), 'success')
      const wrapper = root.closest('#main') || root
      wrapper.innerHTML = shellView()
      mountShell(wrapper)
    } catch (err) {
      status.className = 'form-status is-error'
      status.textContent =
        err.status === 503
          ? tr('Chưa cấu hình ADMIN_PASSWORD. Thêm secret này trong phần cài đặt ứng dụng.', 'ADMIN_PASSWORD is not configured. Add this secret in the app settings.')
          : err.message || tr('Đăng nhập thất bại.', 'Sign in failed.')
    } finally {
      if (btn) btn.disabled = false
    }
  })
}

function mountShell(root) {
  let currentTab = 'leads'
  loadOverview(root, currentTab)
  const host = root.querySelector('#main') || root

  host.addEventListener('click', async (e) => {
    const tab = e.target.closest('[data-admin-tab]')
    if (tab) {
      root.querySelectorAll('[data-admin-tab]').forEach((t) => {
        t.classList.remove('is-active')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('is-active')
      tab.setAttribute('aria-selected', 'true')
      currentTab = tab.dataset.adminTab
      renderContent(root, root._data || { leads: [], bookings: [], lives: [], metrics: [], markets: [] }, currentTab)
      return
    }
    if (e.target.closest('#admin-logout')) {
      try {
        await adminLogout(state.adminToken)
      } catch (_) {}
      setAdminToken(null)
      location.hash = '#/admin'
      location.reload()
      return
    }
    if (e.target.closest('#admin-refresh') || e.target.closest('[data-retry-admin]')) {
      refresh(root)
      return
    }
    if (e.target.closest('#export-csv')) {
      try {
        const blob = await adminExportCsv(state.adminToken)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vhub-leads-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 2000)
      } catch (err) {
        toast(err.message || 'Không xuất được CSV.', 'error')
      }
      return
    }
    if (e.target.closest('[data-live-new]')) {
      openLiveForm(root, null)
      return
    }
    if (e.target.closest('[data-cancel-live]')) {
      const slot = root.querySelector('#live-form-slot')
      if (slot) slot.innerHTML = ''
      return
    }
    const saveLive = e.target.closest('[data-save-live-new]')
    if (saveLive) {
      const id = saveLive.dataset.saveLiveNew || ''
      const payload = {
        id: id || undefined,
        title: root.querySelector('#lf-title').value.trim(),
        brand: root.querySelector('#lf-brand').value.trim(),
        starts_at: fromLocal(root.querySelector('#lf-start').value),
        duration_min: Number(root.querySelector('#lf-duration').value) || 120,
        platform: root.querySelector('#lf-platform').value,
        url: root.querySelector('#lf-url').value.trim(),
      }
      if (!payload.title || !payload.starts_at) {
        toast(tr('Cần nhập tiêu đề và thời gian bắt đầu.', 'Title and start time are required.'), 'error')
        return
      }
      try {
        await adminPost('/api/admin/lives', payload, state.adminToken)
        toast(tr('Đã lưu phiên live.', 'Session saved.'), 'success')
        refresh(root)
      } catch (err) {
        toast(err.message, 'error')
      }
      return
    }
    const saveRow = e.target.closest('[data-live-save]')
    if (saveRow) {
      const id = saveRow.dataset.liveSave
      const get = (field) => {
        const node = root.querySelector(`[data-live-field="${field}"][data-id="${id}"]`)
        return node ? node.value : ''
      }
      try {
        await adminPost(
          '/api/admin/lives',
          {
            id,
            title: get('title'),
            brand: get('brand'),
            starts_at: fromLocal(get('starts_at')),
            duration_min: Number(get('duration_min')) || 120,
            platform: get('platform'),
            url: get('url') || '',
          },
          state.adminToken,
        )
        toast(tr('Đã lưu phiên live.', 'Session saved.'), 'success')
        refresh(root)
      } catch (err) {
        toast(err.message, 'error')
      }
      return
    }
    const del = e.target.closest('[data-live-delete]')
    if (del) {
      if (!window.confirm(tr('Xoá phiên live này?', 'Delete this session?'))) return
      try {
        await adminDelete(`/api/admin/lives/${del.dataset.liveDelete}`, state.adminToken)
        toast(tr('Đã xoá phiên.', 'Session deleted.'), 'success')
        refresh(root)
      } catch (err) {
        toast(err.message, 'error')
      }
      return
    }
    if (e.target.closest('[data-save-metrics]')) {
      const items = $$('[data-metric]', root).map((n) => ({ key: n.dataset.metric, value: Number(n.value) || 0 }))
      try {
        await adminPut('/api/admin/metrics', { items }, state.adminToken)
        toast(tr('Đã lưu số liệu.', 'Metrics saved.'), 'success')
        refresh(root)
      } catch (err) {
        toast(err.message, 'error')
      }
      return
    }
    if (e.target.closest('[data-save-markets]')) {
      const markets = $$('[data-market-row]', root).map((row) => {
        const val = (f) => {
          const node = row.querySelector(`[data-market-field="${f}"]`)
          return node ? node.value : ''
        }
        return {
          id: row.dataset.marketRow,
          revenue: Number(val('revenue')) || 0,
          donation: Number(val('donation')) || 0,
          auction: Number(val('auction')) || 0,
          orders: Number(val('orders')) || 0,
          statement_url: val('statement_url').trim(),
          minutes_url: val('minutes_url').trim(),
        }
      })
      try {
        await adminPut('/api/admin/markets', { markets }, state.adminToken)
        toast(tr('Đã lưu bảng quỹ.', 'Fund table saved.'), 'success')
        refresh(root)
      } catch (err) {
        toast(err.message, 'error')
      }
    }
  })

  host.addEventListener('change', async (e) => {
    const select = e.target.closest('[data-status-kind]')
    if (!select) return
    const kind = select.dataset.statusKind
    const id = select.dataset.id
    try {
      if (kind === 'lead') await adminPatch(`/api/admin/leads/${id}`, { status: select.value }, state.adminToken)
      else await adminPatch(`/api/admin/bookings/${id}`, { status: select.value }, state.adminToken)
      toast(tr('Đã cập nhật trạng thái.', 'Status updated.'), 'success')
    } catch (err) {
      toast(err.message, 'error')
    }
  })
}
