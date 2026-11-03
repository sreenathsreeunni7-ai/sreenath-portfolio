// useSmoothScroll.js
// Sets up Lenis smooth scroll driven by GSAP's ticker so Lenis and every
// ScrollTrigger share exactly ONE animation loop.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register ScrollTrigger once at module load time
gsap.registerPlugin(ScrollTrigger)

export default function useSmoothScroll() {
  useEffect(() => {
    // Respect prefers-reduced-motion: skip smooth scroll entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // --- Lenis instance ---
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    // Keep ScrollTrigger's scroll position in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker (time is in seconds → convert to ms)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0) // prevent jumps after tab switch

    // --- Smooth in-page anchor links ---
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const targetEl = document.querySelector(anchor.getAttribute('href'))
      if (!targetEl) return
      e.preventDefault()
      lenis.scrollTo(targetEl, { offset: -60 })
    }
    document.addEventListener('click', handleAnchorClick)

    // --- Refresh ScrollTrigger after load (images/fonts may shift layout) ---
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 800)

    // --- Cleanup on unmount ---
    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('load', onLoad)
      clearTimeout(refreshTimer)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

