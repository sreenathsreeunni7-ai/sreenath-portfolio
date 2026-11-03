// About.jsx — portrait, heading, stats with count-up, and skills grid.
// Data comes from portfolioData.js. Portrait loaded with import.meta.glob.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// ── Portrait: load whichever file extension is present ──────────────────────
// import.meta.glob is resolved at build-time by Vite.
const portraitModules = import.meta.glob(
  '../assets/about/about-portrait.*',
  { eager: true },
)
const portraitSrc = Object.values(portraitModules)[0]?.default ?? null

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Reveal animation ─────────────────────────────────────────────────
      gsap.from('[data-about="reveal"]', {
        opacity:  0,
        y:        40,
        duration: 0.9,
        ease:     'power3.out',
        stagger:  0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 75%',
          once:    true,
        },
      })

      // ── Count-up for each stat ────────────────────────────────────────────
      // Each counter <span> stores its target in data-stat-target.
      sectionRef.current
        .querySelectorAll('[data-stat-target]')
        .forEach((el) => {
          const target  = Number(el.dataset.statTarget)
          const counter = { val: 0 }
          gsap.to(counter, {
            val:      target,
            duration: 1.6,
            ease:     'power2.out',
            onUpdate() {
              el.textContent = Math.round(counter.val)
            },
            scrollTrigger: {
              trigger: el,
              start:   'top 85%',
              once:    true,
            },
          })
        })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ── Section label ──────────────────────────────────────────────── */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
        </div>

        {/* ── Two-column grid ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">

          {/* ── Left: portrait ─────────────────────────────────────────── */}
          <div data-about="reveal">
            <div className="hud-frame relative aspect-[4/5] max-w-[420px] border border-bone/10 bg-panel overflow-hidden">
              {portraitSrc ? (
                <>
                  <img
                    src={portraitSrc}
                    alt="sreenath — Data analyst, TAP Academy student"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  {/* Signal-orange tint layer */}
                  <div className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none" />
                </>
              ) : (
                /* Placeholder when no portrait file is present */
                <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim select-none">
                  portrait
                </div>
              )}

              {/* ID label — bottom-left */}
              <span className="absolute bottom-3 left-3 pointer-events-none font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50 select-none">
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* ── Right: content ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-10">

            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl"
            >
              {aboutContent.paragraph}
            </p>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <dl
              data-about="reveal"
              className="grid grid-cols-3 border-y border-bone/10 py-8 gap-4"
            >
              {aboutContent.stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {/*
                    <dt> is first in HTML (semantic order) but pushed
                    below the number visually with order-last.
                  */}
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim order-last">
                    {stat.label}
                  </dt>
                  <dd className="text-4xl md:text-6xl font-bold text-bone leading-none">
                    {/* data-stat-target stores the final value for GSAP */}
                    <span data-stat-target={stat.value}>0</span>
                    <span className="text-signal">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* ── Skill modules grid ───────────────────────────────────── */}
            {/*
              gap-px + bg-bone/10 on the wrapper makes the gaps appear as
              1 px bone lines. Each cell has bg-ink to cover the grid colour.
            */}
            <div data-about="reveal">
              <div className="grid sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10">
                {skillGroups.map((group, i) => (
                  <div
                    key={i}
                    className="bg-ink hover:bg-panel p-6 transition-colors duration-200"
                  >
                    {/* Group header row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                        {group.title}
                      </span>
                      <span className="font-mono text-xs text-dim">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/75"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end right column */}
        </div>
      </div>
    </section>
  )
}

