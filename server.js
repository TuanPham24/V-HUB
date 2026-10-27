/**
 * V-HUB — Cloudflare Worker entrypoint.
 * Chỉ định tuyến; toàn bộ nghiệp vụ nằm trong server/routes và server/lib.
 */

import { json } from './server/lib/http.js'
import { migrate } from './server/lib/db.js'
import * as publicApi from './server/routes/public.js'
import { handleAdmin } from './server/routes/admin.js'

export async function handle(request, env) {
  const url = new URL(request.url)

  if (!url.pathname.startsWith('/api/')) {
    return json({ error: 'Không tìm thấy.' }, 404)
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    await migrate(env)
  } catch (err) {
    console.error('migrate failed', err && err.message)
  }

  try {
    if (url.pathname.startsWith('/api/admin')) {
      return await handleAdmin(request, env, url)
    }

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return publicApi.health(env)
    }
    if (url.pathname === '/api/bootstrap' && request.method === 'GET') {
      return publicApi.bootstrap(env)
    }
    if (url.pathname === '/api/leads' && request.method === 'POST') {
      return publicApi.createLead(request, env)
    }
    if (url.pathname === '/api/bookings/availability' && request.method === 'GET') {
      return publicApi.availability(env, url)
    }
    if (url.pathname === '/api/bookings' && request.method === 'POST') {
      return publicApi.createBooking(request, env)
    }
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return publicApi.chat(request, env)
    }

    return json({ error: 'Không tìm thấy API.' }, 404)
  } catch (err) {
    console.error('Unhandled API error', url.pathname, err && err.stack)
    return json({ error: 'Máy chủ gặp sự cố. Vui lòng thử lại.' }, 500)
  }
}
