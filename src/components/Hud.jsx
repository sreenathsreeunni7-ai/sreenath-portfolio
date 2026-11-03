// Hud.jsx — fixed top navigation bar.
// Transparent at top; frosted-glass after 40 px scroll or when mobile menu is open.
// Left: initials badge + brand name. Centre (lg+): pulsing status rotator.
// Right (md+): nav links + live clock in the project timezone.
// Mobile: "Menu / Close" toggle with a full dropdown.

import { useState, useEffect } from 'react'
import { personalInfo, navLinks, heroContent } from '../data/portfolioData'

/** Pull up to 2 uppercase initials from a name string */
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Return current HH:MM:SS in the given IANA timezone */
function formatTime(tz) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour:     '2-digit',
    minute:   '2-digit',
    second:   '2-digit',
    hour12:   false,
  }).format(new Date())
}

export default function Hud() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [statusIdx,  setStatusIdx]  = useState(0)
  const [time,       setTime]       = useState(() => formatTime(personalInfo.timezone))

  const initials = getInitials(personalInfo.brandName)

  // ── Scroll listener ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Status line rotator (every 3.5 s) ───────────────────────────────────
  useEffect(() => {
    const id = setInterval(
      () => setStatusIdx((i) => (i + 1) % heroContent.statusLines.length),
      3500,
    )
    return () => clearInterval(id)
  }, [])

  // ── Live clock (every second) ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(
      () => setTime(formatTime(personalInfo.timezone)),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  // ── Close mobile menu at md+ breakpoint ─────────────────────────────────
  useEffect(() => {
    const mq       = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const frosted = scrolled || menuOpen

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300',
        frosted ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10' : '',
      ].join(' ')}
    >
      {/* ── Bar content ─────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">

        {/* Left: initials badge + brand name */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <span className="w-8 h-8 flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal leading-none select-none">
            {initials}
          </span>
          <span className="hidden sm:block font-mono text-xs uppercase tracking-[0.2em] text-bone">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre: pulsing dot + rotating status line (lg+) */}
        <div
          className="hidden lg:flex items-center gap-2"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            {heroContent.statusLines[statusIdx]}
          </span>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-6">

          {/* Nav links — md+ */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Live clock — md+ */}
          <time
            className="hidden md:block font-mono text-xs tabular-nums text-dim"
            title={personalInfo.timezone}
            dateTime={time}
          >
            {time}
          </time>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors duration-200"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-ink/95 backdrop-blur-md border-t border-bone/10 px-5"
        >
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-2xl font-semibold text-bone border-b border-bone/10 py-4 hover:text-signal transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* City + clock at the bottom of the drawer */}
          <div className="flex items-center justify-between py-4">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim">
              {personalInfo.city}
            </span>
            <time
              className="font-mono text-xs tabular-nums text-dim"
              title={personalInfo.timezone}
              dateTime={time}
            >
              {time}
            </time>
          </div>
        </div>
      )}
    </header>
  )
}

