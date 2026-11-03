// Journey.jsx — vertical timeline of education and experience.
// Each entry has a period, role, organisation and description.
// The connecting line fills as the section scrolls into view (scrub).
// Nodes toggle between lit (signal) and unlit (bone/20) as the user scrolls.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef  = useRef(null)
  const lineRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Reveal cards ───────────────────────────────────────────────────────
      gsap.from('[data-journey="card"]', {
        opacity:  0,
        x:        -32,
        duration: 0.8,
        ease:     'power3.out',
        stagger:  0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 75%',
          once:    true,
        },
      })

      // ── Timeline line fills downward as user scrolls through section ───────
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease:   'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger:             sectionRef.current,
              start:               'top 60%',
              end:                 'bottom 60%',
              scrub:               true,           // fills AND un-fills on reverse
              invalidateOnRefresh: true,
            },
          },
        )
      }

      // ── Nodes light up / dim as they enter / leave view ───────────────────
      sectionRef.current
        .querySelectorAll('[data-journey="node"]')
        .forEach((node) => {
          ScrollTrigger.create({
            trigger:  node,
            start:    'top 65%',
            end:      'bottom 35%',
            // toggleClass is bidirectional (adds on enter, removes on leave)
            toggleClass: { targets: node, className: 'node-lit' },
          })
        })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ── Section label ──────────────────────────────────────────────── */}
        <div className="mb-12">
          <ScrambleText
            text="03 / Journey"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
        </div>

        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone mb-16">
          Where I&apos;ve been.
        </h2>

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        <div className="relative flex flex-col gap-0">

          {/* Vertical line — grows from top via scaleY */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-bone/10">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-signal origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {experience.map((entry, i) => (
            <div
              key={i}
              data-journey="card"
              className="relative pl-10 pb-14 last:pb-0"
            >
              {/* Node dot — toggled by ScrollTrigger toggleClass */}
              <div
                data-journey="node"
                className={[
                  'absolute left-0 top-1.5 w-[15px] h-[15px] border-2 transition-colors duration-300',
                  // default (unlit) state
                  'border-bone/20 bg-ink',
                  // lit state applied by GSAP toggleClass → CSS
                ].join(' ')}
              />

              {/* Period */}
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-2">
                {entry.period}
              </p>

              {/* Role */}
              <h3 className="text-xl md:text-2xl font-bold text-bone leading-snug mb-1">
                {entry.role}
              </h3>

              {/* Organisation */}
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim mb-3">
                {entry.org}
              </p>

              {/* Description */}
              <p className="text-base text-bone/65 max-w-xl leading-relaxed">
                {entry.description}
              </p>

              {/* Thin connector line to the next entry */}
              {i < experience.length - 1 && (
                <div className="absolute left-[7px] top-[22px] w-px h-full bg-bone/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
