// Cursor.jsx
// A custom crosshair cursor: a signal-orange dot that snaps to the pointer
// and a bone ring that follows with a slight delay. Only shown on real
// pointer devices (mouse) and when reduced-motion is not set.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    // Only activate for real pointer (mouse) devices without reduced motion
    const hasPointer   = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasPointer || reducedMotion) return

    // Hide native cursor and reveal our elements
    document.body.classList.add('has-cursor')
    gsap.set([dot, ring], { opacity: 1, xPercent: -50, yPercent: -50 })

    // quickTo gives us a silky-smooth lagged follow for the ring
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    // Dot snaps instantly; ring follows with delay
    const onMove = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      xRing(e.clientX)
      yRing(e.clientY)
    }

    // Expand + tint ring when hovering interactive elements
    const HOT = 'a, button, input, textarea, [data-cursor="hot"]'
    const onOver = (e) => {
      if (!e.target?.closest) return
      const hot = e.target.closest(HOT)
      if (hot) {
        gsap.to(ring, { scale: 1.8, borderColor: '#ff5b1f', duration: 0.2 })
      } else {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(232,230,223,0.6)', duration: 0.2 })
      }
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)

    // Cleanup: restore native cursor and remove listeners
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      {/* Signal-orange dot — snaps exactly to the pointer */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[999] pointer-events-none w-[6px] h-[6px] rounded-full bg-signal"
        style={{ opacity: 0 }}
      />
      {/* Bone ring — follows with a slight lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[999] pointer-events-none w-9 h-9 rounded-full"
        style={{ opacity: 0, border: '1px solid rgba(232,230,223,0.6)' }}
      />
    </>
  )
}

