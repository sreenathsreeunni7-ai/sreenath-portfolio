// Projects.jsx — horizontally scrolling project cards on desktop,
// stacked vertically on mobile. A pinned ScrollTrigger drives the
// card track and a signal-orange progress line.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// ── Cover images: load every supported extension at build time ───────────────
const coverModules = import.meta.glob([
  '../assets/projects/*.png',
  '../assets/projects/*.jpg',
  '../assets/projects/*.jpeg',
  '../assets/projects/*.webp',
  '../assets/projects/*.svg',
], { eager: true })

/** Return the image src for a given project id, or null if none exists. */
function getCoverSrc(projectId) {
  const entry = Object.entries(coverModules).find(([path]) => {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, '') // strip ext
    return filename === projectId
  })
  return entry?.[1]?.default ?? null
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const coverSrc = getCoverSrc(project.id)

  return (
    <article
      className="group border border-bone/10 bg-panel/60 shrink-0 w-full md:w-[min(560px,42vw)] flex flex-col"
      data-cursor="hot"
    >
      {/* ── Cover ────────────────────────────────────────────────────────── */}
      <div className="relative aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        ) : (
          /* Placeholder when no cover file is present */
          <div className="hud-grid w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim select-none">
              {project.id}
            </span>
          </div>
        )}

        {/* Number / year badge */}
        <span className="absolute top-3 left-3 bg-ink/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-signal pointer-events-none">
          {project.number} / {project.year}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-bone/70 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA buttons — pushed to bottom of card */}
        <div className="flex flex-wrap gap-3 mt-auto pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-signal text-ink hover:bg-bone font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors duration-200"
            >
              Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors duration-200"
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    // ── Desktop + no reduced-motion: pin + horizontal scroll ────────────────
    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const section  = sectionRef.current
        const track    = trackRef.current
        const progress = progressRef.current
        if (!section || !track) return

        // Distance the track must travel to show all cards
        const getDistance = () =>
          track.scrollWidth - window.innerWidth + 80

        gsap.to(track, {
          x:    () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger:             section,
            start:               'top top',
            end:                 () => '+=' + getDistance(),
            scrub:               1,
            pin:                 true,
            invalidateOnRefresh: true,
            onUpdate(self) {
              if (progress) {
                gsap.set(progress, { scaleX: self.progress })
              }
            },
          },
        })
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:pt-20 md:pb-6"
    >
      {/* ── Header row ───────────────────────────────────────────────────── */}
      <div className="px-5 md:px-10 flex items-end justify-between mb-10 md:mb-12 shrink-0">
        <div className="flex flex-col gap-3">
          <ScrambleText
            text="02 / Selected work"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>

        {/* Project count hint — desktop only */}
        <span className="hidden md:block font-mono text-xs text-dim shrink-0 pb-1.5">
          {projects.length} project{projects.length !== 1 ? 's' : ''} · scroll →
        </span>
      </div>

      {/* ── Card track ───────────────────────────────────────────────────── */}
      {/*
        Mobile: flex-col (natural vertical stack).
        Desktop: flex-row with w-max so it overflows; GSAP animates x.
        will-change-transform hints the browser to composite this layer.
      */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-5 md:px-10 md:flex-row md:w-max md:gap-8"
        style={{ willChange: 'transform' }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* ── Progress line (desktop only) ─────────────────────────────────── */}
      <div className="hidden md:block mt-auto px-5 md:px-10 pt-6 shrink-0">
        <div className="relative h-px bg-bone/10">
          <div
            ref={progressRef}
            className="absolute inset-0 bg-signal origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  )
}

