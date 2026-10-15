import { useEffect, useRef, useState } from 'react'
import { FiInstagram, FiYoutube, FiLinkedin, FiGithub, FiArrowUpRight } from 'react-icons/fi'
import { SiJavascript, SiLaravel, SiPhp, SiDart, SiFlutter } from 'react-icons/si'
import heroBg from '../assets/hero-bg.jpg'

// Foto: taruh file src/assets/footer.jpg (boleh .png/.webp) -> otomatis kepakai
const found = import.meta.glob('../assets/footer.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })
const photo = Object.values(found)[0]

// TODO: ganti link sosmed lo
const socials = [
  { name: 'Instagram', href: 'https://instagram.com/', Icon: FiInstagram },
  { name: 'YouTube', href: 'https://youtube.com/', Icon: FiYoutube },
  { name: 'LinkedIn', href: 'https://linkedin.com/', Icon: FiLinkedin },
  { name: 'GitHub', href: 'https://github.com/', Icon: FiGithub },
]

// TODO: ganti link di pill bawah
const pill = { label: 'www.instagram.com/username', href: 'https://instagram.com/' }

// sama dengan daftar di page Skills (icon doang)
const skills = [
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E', tilt: '-5deg' },
  { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20', tilt: '4deg' },
  { name: 'PHP', Icon: SiPhp, color: '#8892BF', tilt: '-3deg' },
  { name: 'Dart', Icon: SiDart, color: '#40C4FF', tilt: '5deg' },
  { name: 'Flutter', Icon: SiFlutter, color: '#54C5F8', tilt: '-4deg' },
]

export default function Footer() {
  const trackRef = useRef(null)
  const drag = useRef({ moved: false })
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)

  // chip yang paling dekat ke tengah -> active
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

    // mulai dari chip ke-2 biar kiri-kanannya kelihatan
    const start = track.children[1]
    if (start) track.scrollLeft = start.offsetLeft - (track.clientWidth - start.offsetWidth) / 2
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
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const t = trackRef.current
    const d = drag.current
    const startX = e.clientX
    const startScroll = t.scrollLeft
    d.moved = false
    setDragging(true)
    const move = (ev) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 4) d.moved = true
      t.scrollLeft = startScroll - dx
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setDragging(false)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const scrollToChip = (i) => {
    if (drag.current.moved) { drag.current.moved = false; return }
    const track = trackRef.current
    const el = track.children[i]
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <div className="footer-wrap" id="footer">
      <footer className="footer">
        <div className="footer__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroBg})` }} />

        <div className="footer__grid">
          <figure className="footer__photo">
            {photo ? (
              <img src={photo} alt="Muhammad Fattah Al Hamdani" draggable={false} />
            ) : (
              <div className="footer__ph" aria-hidden="true">MF</div>
            )}
            <div className="footer__socials">
              {socials.map(({ name, href, Icon }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name} title={name}>
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </figure>

          <h2 className="footer__quote">
            Change someone&apos;s life, even just in a <em>small</em> way.
          </h2>

          <div className="footer__right">
            <div
              ref={trackRef}
              className={`chips${dragging ? ' is-dragging' : ''}`}
              onPointerDown={onPointerDown}
              aria-label="Skills"
            >
              {skills.map(({ name, Icon, color, tilt }, i) => (
                <button
                  type="button"
                  key={name}
                  className={`chip${i === active ? ' is-active' : ''}`}
                  style={{ '--brand': color, '--tilt': tilt }}
                  onClick={() => scrollToChip(i)}
                  aria-label={name}
                >
                  <Icon aria-hidden="true" />
                </button>
              ))}
            </div>

            <a className="footer__pill" href={pill.href} target="_blank" rel="noreferrer">
              <span>{pill.label}</span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <p className="footer__copy">© {new Date().getFullYear()} Muhammad Fattah Al Hamdani</p>
      </footer>
    </div>
  )
}