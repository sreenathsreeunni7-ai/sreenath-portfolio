// Hero.jsx — full-viewport landing section.
// Left column: eyebrow, name (scramble), divider, role + intro, CTA buttons.
// Right column: hud-frame box containing the lazy 3-D scene.
// Bottom strip: availability status + scroll hint.

import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

// Lazy-load HeroScene so three.js ships in its own bundle chunk
const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  const sectionRef = useRef(null)

  // Split brand name: first word = solid bone, rest = outlined
  const words     = personalInfo.brandName.trim().split(/\s+/)
  const firstWord = words[0]
  const restWords = words.slice(1).join(' ')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade-up for content blocks — once only, never hides again
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity:         1,
          y:               0,
          duration:        1,
          ease:            'power3.out',
          stagger:         0.12,
          delay:           0.3,
          immediateRender: false,
          clearProps:      'opacity,transform',
        },
      )

      // Divider grows from the left edge — clears scaleX so it stays full-width
      gsap.fromTo(
        '[data-hero="divider"]',
        { scaleX: 0 },
        {
          scaleX:          1,
          duration:        1.2,
          ease:            'power3.inOut',
          delay:           0.3,
          transformOrigin: 'left center',
          clearProps:      'scaleX,transform',
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hud-grid min-h-screen flex flex-col overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* ── Two-column content grid ───────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto w-full flex-1 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">

        {/* ── Left: text ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Eyebrow */}
          <p
            data-hero="fade"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          >
            {heroContent.eyebrow}
          </p>

          {/* Name — first word solid, rest outlined */}
          <h1
            data-hero="fade"
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          >
            {/* Solid bone line */}
            <ScrambleText
              as="span"
              text={firstWord}
              trigger="mount"
              delay={200}
              className="block text-bone"
            />

            {/* Outlined line (only when there is a second word) */}
            {restWords && (
              <span
                style={{
                  WebkitTextStroke: '1.5px #e8e6df',
                  color:            'transparent',
                  display:          'block',
                }}
              >
                <ScrambleText
                  as="span"
                  text={restWords}
                  trigger="mount"
                  delay={500}
                />
              </span>
            )}
          </h1>

          {/* Thin divider — scales in from the left */}
          <div
            data-hero="divider"
            className="h-px max-w-xl bg-bone/25 origin-left"
          />

          {/* Role + intro paragraph */}
          <div data-hero="fade" className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </p>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed max-w-xl">
              {heroContent.intro}
            </p>
          </div>

          {/* CTA buttons */}
          <div data-hero="fade" className="flex flex-wrap gap-4 mt-2">
            {/* Primary — filled signal */}
            <a
              href={heroContent.ctaPrimary.href}
              className="group inline-flex items-center gap-2 bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200"
            >
              {heroContent.ctaPrimary.label}
              {/* Arrow nudges right on hover */}
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* Secondary — outlined */}
            <a
              href={heroContent.ctaSecondary.href}
              className="inline-flex items-center gap-2 border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* ── Right: 3-D scene ───────────────────────────────────────────── */}
        <div data-hero="fade">
          {/*
            hud-frame draws signal-orange corner brackets via CSS ::before / ::after.
            The panel box holds the canvas + two tiny HUD labels.
          */}
          <div className="hud-frame relative border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh]">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>

            {/* Top-left label */}
            <span className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] uppercase tracking-[0.25em] text-dim select-none">
              core.view — drag to rotate
            </span>

            {/* Bottom-right label */}
            <span className="absolute bottom-3 right-3 pointer-events-none font-mono text-[10px] uppercase tracking-[0.25em] text-dim select-none">
              {personalInfo.city}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto w-full mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shrink-0" />
          <span>{personalInfo.availability}</span>
        </div>
        <span className="hidden sm:block">Scroll ↓</span>
      </div>
    </section>
  )
}

