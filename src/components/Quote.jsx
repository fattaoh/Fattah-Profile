import { useEffect, useRef } from 'react'
import city from '../assets/city.jpg'
import heroBg from '../assets/hero-bg.jpg'

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

      // quote & gambar muncul SESUAI scroll, lalu hilang SESUAI scroll
      const fadeOut = 1 - ramp(p, 0.62, 0.78)
      card.style.setProperty('--t', (ramp(p, 0.2, 0.38) * fadeOut).toFixed(3))  // quote
      card.style.setProperty('--i', (ramp(p, 0.3, 0.48) * fadeOut).toFixed(3))  // gambar
      card.style.setProperty('--card', (1 - ramp(p, 0.78, 0.9)).toFixed(3))     // layar gelap -> abu-abu
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
            <div className="quote__img">
              <img src={city} alt="Black and white aerial view of a city at night" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}