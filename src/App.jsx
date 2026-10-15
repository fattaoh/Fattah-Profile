import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import heroBg from './assets/hero-bg.jpg'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Mentoring from './components/Mentoring.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Quote from './components/Quote.jsx'

export default function App() {
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const midRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)

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
    const mentoring = document.getElementById('mentoring')
    const skills = document.getElementById('skills')
    const projects = document.getElementById('projects')
    const quote = document.getElementById('quote')
    const pinnedTop = (el) => parseFloat(el.style.top || '0')
    const covered = (el, pin = 0) => el && el.getBoundingClientRect().top <= pin + 0.5
    const hide = (ref, yes) => { if (ref.current) ref.current.style.visibility = yes ? 'hidden' : 'visible' }

    const update = () => {
      hide(heroRef, covered(about))                                                              // Hero ketutup About
      hide(aboutRef, covered(mentoring))                                                         // About ketutup Mentoring
      hide(midRef, skillsRef.current && covered(skills, pinnedTop(skillsRef.current)))           // Mentoring ketutup Skills
      hide(skillsRef, projectsRef.current && covered(projects, pinnedTop(projectsRef.current)))  // Skills ketutup Projects
      hide(projectsRef, covered(quote))                                                          // Projects ketutup Quote
    }
    lenis.on('scroll', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  // Page yang lebih tinggi dari layar: pin bagian BAWAHnya ke bawah layar,
  // lalu page berikutnya naik menimpa.
  useEffect(() => {
    const els = [aboutRef.current, midRef.current, skillsRef.current, projectsRef.current]
    const setTop = () => {
      els.forEach((el) => {
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`
      })
    }
    setTop()
    const ro = new ResizeObserver(setTop)
    els.forEach((el) => ro.observe(el))
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
      <div ref={aboutRef} className="stack-about">
        <About />
      </div>
      <div ref={midRef} className="stack-mid">
        <Mentoring />
      </div>
      <div ref={skillsRef} className="stack-skills">
        <Skills />
      </div>
      <div ref={projectsRef} className="stack-projects">
        <Projects />
      </div>
      <Quote />
    </main>
  )
}