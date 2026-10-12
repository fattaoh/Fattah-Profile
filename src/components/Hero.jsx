import { useState } from 'react'
import heroBg from '../assets/hero-bg.jpg'

const Asterisk = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
  </svg>
)

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <rect width="30" height="30" rx="8" fill="#232323" />
    <g stroke="#f4f4f4" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M15 6.5l4 4-4 4-4-4z" />
      <path d="M8.5 13l4 4-4 4-4-4z" transform="translate(2.5 -1)" />
      <path d="M21.5 13l4 4-4 4-4-4z" transform="translate(-2.5 -1)" />
    </g>
  </svg>
)

const mentoring = [
  { initials: 'PB', school: 'SMP Persada Bakti Bekasi' },
  { initials: 'N9', school: 'SMA Negeri 9 Bekasi' },
  { initials: 'RJ', school: 'SMA Rejis Bekasi' },
]

const links = ['About', 'Projects', 'Mentoring', 'Contact']

export default function Hero() {
  const [open, setOpen] = useState(false)

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroBg})` }} />

      <div className="shell">
        <header className="nav">
          <a className="brand" href="#top" aria-label="Muhammad Fattah Al Hamdani, home">
            <Logo />
            <span>Fattah Al Hamdani</span>
          </a>

          <div className="menu">
            <button
              className="menu__btn"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
              <span className="menu__icon" aria-hidden="true">
                <i /><i />
              </span>
            </button>
            {open && (
              <ul id="site-menu" className="menu__list">
                {links.map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="top">
          <div className="headline">
            <div className="tag" aria-hidden="true">
              <span>Dev</span>
              <Asterisk size={11} />
              <span>Mentor</span>
            </div>
            <h1 className="title">
              <span className="line"><span className="line__in">Build Software</span></span>
              <span className="line">
                <span className="line__in">
                  Grow <em>Developers</em>
                </span>
              </span>
            </h1>
            <div className="stars" aria-hidden="true">
              <Asterisk size={22} /><Asterisk size={22} />
            </div>
          </div>

          <div className="intro">
            <div className="cta">
              <a className="cta__link" href="#contact">
                Let’s talk
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <div className="cta__proof">
                <p>Mentor at 3 schools in Bekasi</p>
                <ul className="stack" aria-label="Schools where I mentored">
                  {mentoring.map((m) => (
                    <li key={m.initials} title={m.school}>
                      <span>{m.initials}</span>
                      <span className="sr">{m.school}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="about">
              Muhammad Fattah Al Hamdani is a software developer who builds clean, reliable
              web applications. He has also mentored students in programming at three schools
              in Bekasi, helping beginners write real code with confidence.
            </p>
          </div>
        </div>

        </div>
    </section>
  )
}