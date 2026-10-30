/** Trình xem 360°: nhận ảnh toàn cảnh (kéo để xoay) hoặc URL nhúng; chưa có thì ảnh tĩnh. */

import { esc } from '../lib/dom.js'
import { icon } from '../lib/icons.js'
import { tr } from '../lib/i18n.js'
import { media } from './ui.js'

export function viewer360Markup({ studio, label, height = '16x10' }) {
  const pano = studio && studio.panoramaUrl
  const embed = studio && studio.embedUrl
  if (embed) {
    return `<div class="viewer-360">
      <div class="viewer-360__stage"><iframe src="${esc(embed)}" title="${tr('Tham quan 360°', '360° tour')} ${esc(studio.name)}" loading="lazy" allowfullscreen></iframe></div>
      <span class="viewer-360__hint">${tr('Kéo hoặc dùng chuột để xoay', 'Drag to look around')}</span>
    </div>`
  }
  if (pano) {
    return `<div class="viewer-360">
      <div class="viewer-360__stage" data-pan data-src="${esc(pano)}" style="background-image:url('${esc(pano)}');background-size:auto 100%;background-position:center" role="img" aria-label="${tr('Ảnh toàn cảnh', 'Panorama')} ${esc(studio.name)}"></div>
      <span class="viewer-360__hint">${tr('Kéo ngang để xoay 360°', 'Drag horizontally to pan')}</span>
    </div>`
  }
  return `<div class="viewer-360">
    <div class="viewer-360__stage">
      ${media({ src: studio?.images[0]?.src, pending: studio?.images[0]?.pending, alt: studio?.images[0]?.alt, caption: studio?.images[0]?.caption, label: (studio?.images[0]?.pending ? studio.images[0].label : label) || tr('Ảnh studio V-HUB', 'V-HUB studio image'), ratio: height })}
      <span class="viewer-360__hint">${studio?.images[0]?.src
        ? tr('Chưa có file toàn cảnh — đang hiển thị ảnh tĩnh', 'No panorama file yet — showing a still image')
        : tr('Ảnh studio và ảnh toàn cảnh 360° đang chờ bổ sung', 'Studio image and 360° panorama pending')}</span>
    </div>
  </div>`
}

export function attach360(root = document) {
  root.querySelectorAll('[data-pan]').forEach((stage) => {
    let startX = 0
    let startPos = 50
    let dragging = false
    const setPos = (value) => {
      const v = Math.max(0, Math.min(100, value))
      startPos = v
      stage.style.backgroundPosition = `${v}% center`
    }
    stage.addEventListener('pointerdown', (e) => {
      dragging = true
      startX = e.clientX
      stage.classList.add('is-dragging')
      stage.setPointerCapture(e.pointerId)
    })
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return
      const delta = ((e.clientX - startX) / stage.clientWidth) * 100
      setPos(startPos - delta)
    })
    const end = () => {
      dragging = false
      stage.classList.remove('is-dragging')
    }
    stage.addEventListener('pointerup', end)
    stage.addEventListener('pointercancel', end)
    stage.addEventListener('pointerleave', end)
  })
}

export function viewerIcon() {
  return icon('rotate')
}
