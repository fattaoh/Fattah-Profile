import { useEffect, useRef, useState } from 'react'
import city from '../assets/city.jpg'

// Semua foto di folder src/assets/gallery/ otomatis kepakai (urut sesuai nama file: 01, 02, 03, 04)
const found = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' })
const list = Object.keys(found).sort().map((k) => found[k])
const images = list.length ? list : [city]

const mod = (a, n) => ((a % n) + n) % n

export default function Gallery() {
  const n = images.length
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const s = useRef({ pos: 0, target: 0, raf: 0, last: 0, dragging: false, moved: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, vx: 0, wheelAt: 0 })
  const [current, setCurrent] = useState(0)
  const [dragging, setDragging] = useState(false)

  // posisi tiap foto di "lingkaran": yang di depan membesar, sisanya mundur ke belakang
  const render = () => {
    const stage = stageRef.current
    if (!stage) return
    const R = stage.clientWidth * 0.36
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      let d = i - s.current.pos
      d = mod(d + n / 2, n) - n / 2
      const th = d * ((2 * Math.PI) / n)
      const x = Math.sin(th) * R
      const z = (Math.cos(th) - 1) * R
      const op = Math.pow((Math.cos(th) + 1) / 2, 1.2)
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(-th * 57.2958 * 0.4).toFixed(2)}deg)`
      el.style.opacity = op.toFixed(3)
      el.style.zIndex = String(1000 + Math.round(z))
      el.style.pointerEvents = op < 0.3 ? 'none' : 'auto'
    })
  }

  const tick = (t) => {
    const st = s.current
    const dt = Math.min(0.05, (t - st.last) / 1000 || 0.016)
    st.last = t
    if (!st.dragging) st.pos += (st.target - st.pos) * (1 - Math.exp(-dt * 9))
    render()
    if (st.dragging || Math.abs(st.target - st.pos) > 0.001) {
      st.raf = requestAnimationFrame(tick)
    } else {
      st.pos = st.target
      render()
      st.raf = 0
    }
  }
  const kick = () => {
    if (!s.current.raf) {
      s.current.last = performance.now()
      s.current.raf = requestAnimationFrame(tick)
    }
  }

  const setTarget = (t) => {
    s.current.target = t
    setCurrent(mod(Math.round(t), n))
    kick()
  }
  const go = (delta) => setTarget(Math.round(s.current.target) + delta)
  const goTo = (i) => {
    const cur = Math.round(s.current.target)
    const delta = mod(i - cur + n / 2, n) - n / 2
    setTarget(cur + delta)
  }

  useEffect(() => {
    render()
    const ro = new ResizeObserver(render)
    ro.observe(stageRef.current)

    // swipe horizontal di trackpad
    const stage = stageRef.current
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 25) return
      e.preventDefault()
      const now = performance.now()
      if (now - s.current.wheelAt < 450) return
      s.current.wheelAt = now
      go(e.deltaX > 0 ? 1 : -1)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      ro.disconnect()
      stage.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(s.current.raf)
    }
    // eslint-disable-next-line
  }, [])

  // drag (mouse & touch)
  const onPointerDown = (e) => {
    if (n < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return
    const st = s.current
    st.dragging = true
    st.moved = false
    st.startX = e.clientX
    st.startPos = st.pos
    st.lastX = e.clientX
    st.lastT = performance.now()
    st.vx = 0
    setDragging(true)
    kick()

    const W = stageRef.current.clientWidth * 0.3
    const move = (ev) => {
      const dx = ev.clientX - st.startX
      if (Math.abs(dx) > 5) st.moved = true
      const now = performance.now()
      const dt = Math.max(1, now - st.lastT)
      st.vx = (ev.clientX - st.lastX) / dt
      st.lastX = ev.clientX
      st.lastT = now
      st.pos = st.startPos - dx / W
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      st.dragging = false
      setDragging(false)
      const flick = Math.max(-1.2, Math.min(1.2, (-st.vx * 220) / W))
      setTarget(Math.round(st.pos + flick))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }

  return (
    <div className="quote__img gallery">
      <div
        ref={stageRef}
        className={`gallery__stage${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Galeri foto"
      >
        {images.map((src, i) => (
          <figure
            key={src}
            ref={(el) => (cardRefs.current[i] = el)}
            className="gallery__card"
            onClick={() => { if (!s.current.moved) goTo(i) }}
          >
            <img src={src} alt={`Foto ${i + 1} dari ${n}`} draggable={false} />
          </figure>
        ))}
      </div>

      {n > 1 && (
        <div className="gallery__ctrl">
          <button type="button" className="gallery__btn" onClick={() => go(-1)} aria-label="Foto sebelumnya">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="gallery__dots">
            {images.map((_, i) => (
              <button key={i} type="button" className={`gallery__dot${i === current ? ' is-active' : ''}`} onClick={() => goTo(i)} aria-label={`Foto ${i + 1}`} />
            ))}
          </div>
          <button type="button" className="gallery__btn" onClick={() => go(1)} aria-label="Foto berikutnya">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}