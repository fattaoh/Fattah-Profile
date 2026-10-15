import { useEffect, useRef, useState } from 'react'

// TODO: ganti dengan project asli lo (name, tag, desc, github)
const projects = [
  { name: 'Project One', tag: 'Web App · Laravel', desc: 'Aplikasi yang digunakan untuk melihat profile beberapa karakter Tekken', github: 'https://github.com/fattaoh/tekken_character_project.git' },
  { name: 'Project Two', tag: 'Mobile App · Flutter', desc: 'Website yang berisi buku-buku yg bisa dipinjam (Prototype)', github: 'https://github.com/fattaoh/E_Library.git' },
  { name: 'Project Three', tag: 'Website · JavaScript', desc: 'Ganti dengan deskripsi project ini: apa itu, buat siapa, dan masalah apa yang dipecahkan.', github: 'https://github.com/fattaoh/skl3Payroll.git' },
  { name: 'Project Four', tag: 'Web App · PHP', desc: 'Ganti dengan deskripsi project ini: apa itu, buat siapa, dan masalah apa yang dipecahkan.', github: 'https://github.com/fattaoh/E-Commerce.git' },
]

export default function Projects() {
  const trackRef = useRef(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0 })
  const pending = useRef(null) // card yang lagi dituju pas dipencet
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
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

  // kalau card yang kebuka udah nggak di tengah (digeser), tutup otomatis
  useEffect(() => {
    if (pending.current !== null) {
      // lagi geser ke card yang dipencet: jangan ditutup dulu
      if (active === pending.current) pending.current = null
      return
    }
    if (open !== null && open !== active) setOpen(null)
  }, [active, open])

  // drag pakai mouse (touchscreen udah bisa digeser native)
  // catatan: nggak pakai setPointerCapture, supaya klik di card tetap kebaca
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const t = trackRef.current
    const d = drag.current
    d.down = true
    d.moved = false
    d.startX = e.clientX
    d.startScroll = t.scrollLeft
    setDragging(true)

    const move = (ev) => {
      const dx = ev.clientX - d.startX
      if (Math.abs(dx) > 4) d.moved = true
      t.scrollLeft = d.startScroll - dx
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      d.down = false
      setDragging(false)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const scrollToProject = (i) => {
    const track = trackRef.current
    const el = track.children[i]
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
  }

  // dipencet: geser ke tengah + buka detail (kalau udah kebuka, tutup)
  const press = (i) => {
    if (drag.current.moved) { drag.current.moved = false; return }
    pending.current = i === active ? null : i
    scrollToProject(i)
    setOpen((cur) => (cur === i ? null : i))
  }

  // panah keyboard, aktif selama page ini kelihatan di layar
  useEffect(() => {
    const track = trackRef.current
    const onKey = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return
      const r = track.getBoundingClientRect()
      if (!(r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2)) return
      if (getComputedStyle(track.closest('.stack-projects') || track).visibility === 'hidden') return
      e.preventDefault()
      const next = Math.max(0, Math.min(projects.length - 1, active + (e.key === 'ArrowRight' ? 1 : -1)))
      scrollToProject(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <div className="skills-wrap projects-wrap" id="projects">
      <section className="skills projects" aria-label="Projects">
        <header className="skills__head">
          <h2 className="skills__title">Projects</h2>
          <p className="skills__count" aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
        </header>

        <div
          ref={trackRef}
          className={`skills__track${dragging ? ' is-dragging' : ''}`}
          onPointerDown={onPointerDown}
        >
          {projects.map((p, i) => (
            <article
              key={p.name}
              className={`proj${i === active ? ' is-active' : ''}${open === i ? ' is-open' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={open === i}
              onClick={() => press(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(i) } }}
            >
              <div className="proj__top">
                <span className="proj__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="proj__plus" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </div>

              <div className="proj__body">
                <h3 className="proj__name">{p.name}</h3>
                <p className="proj__tag">{p.tag}</p>
                <div className="proj__more">
                  <div>
                    <p className="proj__desc">{p.desc}</p>
                    <a
                      className="proj__link"
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="skills__foot">
          <p className="skills__hint">Press a card for details · Drag or swipe →</p>
          <nav className="skills__nav" aria-label="Pilih project">
            {projects.map((p, i) => (
              <button
                type="button"
                key={p.name}
                className={`skills__dot proj__dot${i === active ? ' is-active' : ''}`}
                onClick={() => scrollToProject(i)}
                aria-label={p.name}
                aria-current={i === active}
                title={p.name}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </nav>
        </footer>
      </section>
    </div>
  )
}