import { useEffect, useRef, useState } from 'react'
import { SiJavascript, SiLaravel, SiPhp, SiDart, SiFlutter } from 'react-icons/si'

const skills = [
  { name: 'JavaScript', type: 'Language', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Laravel', type: 'Framework', Icon: SiLaravel, color: '#FF2D20' },
  { name: 'PHP', type: 'Language', Icon: SiPhp, color: '#8892BF' },
  { name: 'Dart', type: 'Language', Icon: SiDart, color: '#40C4FF' },
  { name: 'Flutter', type: 'Framework', Icon: SiFlutter, color: '#54C5F8' },
]

export default function Skills() {
  const trackRef = useRef(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0 })
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)

  // cari card yang paling dekat ke tengah -> jadi "active"
  useEffect(() => {
    const track = trackRef.current
    let raf
    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      ;[...track.children].forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setActive(best)
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  // drag pakai mouse (touchscreen udah bisa digeser native)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    const t = trackRef.current
    drag.current = { down: true, moved: false, startX: e.clientX, startScroll: t.scrollLeft }
    setDragging(true)
    t.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    trackRef.current.scrollLeft = d.startScroll - dx
  }
  const endDrag = () => {
    drag.current.down = false
    setDragging(false)
  }

  // geser track sampai skill ke-i ada di tengah (cuma geser horizontal, halaman nggak ikut turun)
  const scrollToSkill = (i) => {
    const track = trackRef.current
    const el = track.children[i]
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
  }
  const goTo = (i) => {
    if (drag.current.moved) { drag.current.moved = false; return }
    scrollToSkill(i)
  }

  return (
    <div className="skills-wrap" id="skills">
      <section className="skills" aria-label="Skills">
        <header className="skills__head">
          <h2 className="skills__title">Skills</h2>
          <p className="skills__count" aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}
          </p>
        </header>

        <div
          ref={trackRef}
          className={`skills__track${dragging ? ' is-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {skills.map(({ name, type, Icon, color }, i) => (
            <button
              type="button"
              key={name}
              className={`skill${i === active ? ' is-active' : ''}`}
              style={{ '--brand': color }}
              onClick={() => goTo(i)}
              aria-label={`${name}, ${type}`}
            >
              <Icon className="skill__icon" aria-hidden="true" />
              <span className="skill__info">
                <span className="skill__name">{name}</span>
                <span className="skill__type">{type}</span>
              </span>
            </button>
          ))}
        </div>

        <footer className="skills__foot">
          <p className="skills__hint">Drag or swipe →</p>
          <nav className="skills__nav" aria-label="Pilih skill">
            {skills.map(({ name, Icon, color }, i) => (
              <button
                type="button"
                key={name}
                className={`skills__dot${i === active ? ' is-active' : ''}`}
                style={{ '--brand': color }}
                onClick={() => scrollToSkill(i)}
                aria-label={name}
                aria-current={i === active}
                title={name}
              >
                <Icon aria-hidden="true" />
              </button>
            ))}
          </nav>
        </footer>
      </section>
    </div>
  )
}