// ScrambleText.jsx
// Renders text with a "decode" scramble effect: random glyphs resolve into
// the real characters from left to right. Plays once on mount or on view.
// Screen readers always see the real text via aria-label.

import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

/** Pick a random glyph from the set above */
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

/**
 * ScrambleText
 * @param {string}  text       - The real text to display
 * @param {string}  as         - HTML tag to use (default 'span')
 * @param {string}  className  - Extra Tailwind / CSS classes
 * @param {number}  delay      - Ms to wait before starting (default 0)
 * @param {number}  speed      - Ms between frames (default 30)
 * @param {string}  trigger    - 'view' (IntersectionObserver) or 'mount'
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text)
  const elRef     = useRef(null)
  const hasPlayed = useRef(false)

  useEffect(() => {
    // With reduced motion, just show the text immediately — no effect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /**
     * Runs the scramble animation once.
     * Returns a cleanup function that cancels the interval.
     */
    function play() {
      if (hasPlayed.current) return () => {}
      hasPlayed.current = true

      let frame       = 0
      let lockedCount = 0
      const total     = text.length

      const interval = setInterval(() => {
        // Lock one more character every 2 frames (left → right)
        if (frame % 2 === 0 && lockedCount < total) lockedCount++

        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ')    return ' '  // spaces never scramble
              if (i < lockedCount) return char  // already locked in
              return randomGlyph()
            })
            .join('')
        )

        frame++

        // All characters locked — done
        if (lockedCount >= total) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, speed)

      return () => clearInterval(interval)
    }

    let cancelPlay  = () => {}
    let timeoutId   = null

    if (trigger === 'mount') {
      // Start after optional delay
      timeoutId = setTimeout(() => {
        cancelPlay = play()
      }, delay)

      return () => {
        clearTimeout(timeoutId)
        cancelPlay()
      }
    }

    // trigger === 'view' — observe until 40 % of the element is visible
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timeoutId = setTimeout(() => {
          cancelPlay = play()
        }, delay)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
      cancelPlay()
    }
  }, [text, delay, speed, trigger])

  return (
    // aria-label gives screen readers the real text; the visible span is hidden from AT
    <Tag ref={elRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}

