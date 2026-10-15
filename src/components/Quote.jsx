import { useEffect, useRef } from 'react'
import heroBg from '../assets/hero-bg.jpg'
import Gallery from './Gallery.jsx'

export default function Quote() {
  const wrapRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const card = cardRef.current
    const clamp = (v) => Math.min(1, Math.max(0, v))
    const ramp = (p, from, to) => clamp((p - from) / (to - from))
    const update = () => {
      const r = wrap.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = range > 0 ? -r.top / range : 0

      // abu-abu -> gelap (tiba-tiba, kepicu pas p lewat 0.12)
      card.dataset.on = p >= 0.12 ? 'true' : 'false'

      // quote & galeri muncul SESUAI scroll
            card.style.setProperty('--t', ramp(p, 0.2, 0.4).toFixed(3))  // quote
      card.style.setProperty('--i', ramp(p, 0.3, 0.5).toFixed(3))  // galeri
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={wrapRef} className="quote-wrap" id="quote">
      <div className="quote-sticky">
        <section ref={cardRef} className="quote" data-on="false" aria-label="Quote">
          <div className="quote__gray" aria-hidden="true" style={{ backgroundImage: `url(${heroBg})` }} />
          <div className="quote__content">
            <blockquote className="quote__text">
              “To live is to be known and <em>remembered</em> by others.”
            </blockquote>
            <Gallery />
          </div>
        </section>
      </div>
    </div>
  )
}