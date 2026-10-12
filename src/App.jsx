import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import heroBg from './assets/hero-bg.jpg'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Mentoring from './components/Mentoring.jsx'
import Quote from './components/Quote.jsx'
import Skills from './components/Skills.jsx'

export default function App() {
  const heroRef = useRef(null)
  const midRef = useRef(null)

  // Lenis smooth scroll + sembunyiin page yang udah ketutup penuh
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const about = document.getElementById('about')
    const quote = document.getElementById('quote')
    const covered = (el) => el && el.getBoundingClientRect().top <= 0
    const update = () => {
      if (heroRef.current) heroRef.current.style.visibility = covered(about) ? 'hidden' : 'visible'
      if (midRef.current) midRef.current.style.visibility = covered(quote) ? 'hidden' : 'visible'
    }
    lenis.on('scroll', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  // Mentoring lebih tinggi dari layar: pin bagian BAWAHnya ke bawah layar,
  // lalu page Quote naik menimpa.
  useEffect(() => {
    const el = midRef.current
    const setTop = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`
    }
    setTop()
    const ro = new ResizeObserver(setTop)
    ro.observe(el)
    window.addEventListener('resize', setTop)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', setTop)
    }
  }, [])

  return (
    <main className="page">
      <div className="hero__bg" aria-hidden="true" style={{ backgroundImage: `url(${heroBg})` }} />
      <div ref={heroRef} className="stack-under">
        <Hero />
      </div>
      <About />
      <div ref={midRef} className="stack-mid">
        <Mentoring />
      </div>
      <Quote />
      <Skills />
    </main>
  )
}