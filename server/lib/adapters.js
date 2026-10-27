/**
 * Adapter tích hợp ngoài — tất cả đều là giả lập có kiểm soát.
 * Bật bằng biến môi trường; thiếu biến thì bỏ qua và website vẫn chạy đủ tính năng.
 * Không adapter nào được phép ném lỗi ra ngoài (chỉ log).
 */

import { ASSISTANT_BRIEF } from './content-mirror.js'

/** Gửi lead tới CRM/webhook nếu có cấu hình. */
export async function forwardLead(env, lead) {
  const out = { webhook: 'skipped', crm: 'skipped' }
  if (env.LEAD_WEBHOOK_URL) {
    try {
      const res = await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'vhub-website', lead }),
        signal: AbortSignal.timeout(6000),
      })
      out.webhook = res.ok ? 'sent' : `failed:${res.status}`
    } catch (err) {
      out.webhook = 'failed'
      console.error('Lead webhook failed', err && err.message)
    }
  }
  if (env.CRM_WEBHOOK_URL) {
    try {
      const res = await fetch(env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env.CRM_API_KEY ? { Authorization: `Bearer ${env.CRM_API_KEY}` } : {}),
        },
        body: JSON.stringify({ type: 'lead.created', data: lead }),
        signal: AbortSignal.timeout(6000),
      })
      out.crm = res.ok ? 'sent' : `failed:${res.status}`
    } catch (err) {
      out.crm = 'failed'
      console.error('CRM webhook failed', err && err.message)
    }
  }
  return out
}

/**
 * Gửi thông báo Zalo OA — giả lập khi chưa có token.
 * Khi có ZALO_OA_ACCESS_TOKEN, gọi API thật của Zalo (gửi tin theo số điện thoại đã quan tâm OA).
 */
export async function notifyZalo(env, { phone, message }) {
  if (!env.ZALO_OA_ACCESS_TOKEN) {
    return { mode: 'mock', sent: false, note: 'Chưa cấu hình ZALO_OA_ACCESS_TOKEN — bỏ qua gửi Zalo.' }
  }
  try {
    const res = await fetch('https://business.openapi.zalo.me/message/template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: env.ZALO_OA_ACCESS_TOKEN },
      body: JSON.stringify({ phone, template_id: env.ZALO_TEMPLATE_ID || '', template_data: { message } }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const detail = await res.text()
      console.error('Zalo send failed', res.status, detail.slice(0, 200))
      return { mode: 'live', sent: false }
    }
    return { mode: 'live', sent: true }
  } catch (err) {
    console.error('Zalo send error', err && err.message)
    return { mode: 'live', sent: false }
  }
}

/**
 * Tra cứu định danh KOC trên KOCViet — giả lập.
 * Khi có KOCVIET_API_URL + KOCVIET_API_KEY, gọi endpoint thật và trả về kết quả.
 */
export async function lookupKoc(env, { phone }) {
  if (!env.KOCVIET_API_URL || !env.KOCVIET_API_KEY) {
    return { mode: 'mock', verified: false, note: 'Chưa kết nối KOCViet API — dữ liệu minh hoạ.' }
  }
  try {
    const res = await fetch(`${env.KOCVIET_API_URL.replace(/\/$/, '')}/creators/lookup?phone=${encodeURIComponent(phone)}`, {
      headers: { Authorization: `Bearer ${env.KOCVIET_API_KEY}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { mode: 'live', verified: false }
    const data = await res.json()
    return { mode: 'live', verified: Boolean(data && data.verified), tier: data && data.tier }
  } catch (err) {
    console.error('KOCViet lookup failed', err && err.message)
    return { mode: 'live', verified: false }
  }
}

/** Dựng ngữ cảnh nội dung cho trợ lý LLM (bản tóm tắt phía máy chủ). */
export function buildAssistantContext() {
  return ASSISTANT_BRIEF
}

/**
 * Trợ lý AI: dùng AI_API_KEY (OpenAI-compatible). Thiếu key → trả về null để route báo 503.
 */
export async function askAssistant(env, { message, history }) {
  if (!env.AI_API_KEY) return null
  const endpoint = env.AI_BASE_URL || 'https://api.openai.com/v1/chat/completions'
  const model = env.AI_MODEL || 'gpt-4o-mini'
  const system = [
    'Bạn là trợ lý tư vấn của V-HUB, hệ thống MCN thương mại điện tử thuộc hệ sinh thái VTV Nam Bộ.',
    'Trả lời bằng tiếng Việt, ngắn gọn (tối đa 120 từ), lịch sự, không dùng từ ngữ nội bộ.',
    'Chỉ dùng thông tin dưới đây. Nếu không có thông tin, đề nghị để lại số điện thoại hoặc gọi hotline.',
    'Không bịa số liệu, không cam kết doanh số, không nêu giá cuối cùng nếu chưa có báo giá.',
    'Luôn kết thúc bằng một lời mời cụ thể: đặt lịch tư vấn 60 phút hoặc để lại số điện thoại.',
    '',
    'DỮ LIỆU:',
    buildAssistantContext(),
  ].join('\n')

  const messages = [{ role: 'system', content: system }]
  for (const item of (history || []).slice(-6)) {
    if (!item || !item.text) continue
    messages.push({ role: item.who === 'user' ? 'user' : 'assistant', content: String(item.text).slice(0, 800) })
  }
  messages.push({ role: 'user', content: String(message).slice(0, 1200) })

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.AI_API_KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 320 }),
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) {
      const detail = await res.text()
      console.error('AI error', res.status, detail.slice(0, 200))
      return null
    }
    const data = await res.json()
    const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
    return reply ? String(reply).slice(0, 2000) : null
  } catch (err) {
    console.error('AI request failed', err && err.message)
    return null
  }
}
