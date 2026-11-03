// Footer.jsx — three-column link grid, huge faint watermark and bottom bar.
// The TAP Academy credit is required by project convention (see AGENTS.md).

import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData'

// External social links — empty hrefs are skipped.
const SOCIALS = [
  { label: 'GitHub',    href: socialLinks.github    },
  { label: 'LinkedIn',  href: socialLinks.linkedin   },
  { label: 'Instagram', href: socialLinks.instagram  },
].filter((s) => s.href)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Three-column link grid ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-14">

          {/* Column 1 — Navigate */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1">
              Navigate
            </p>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-bone/75 hover:text-signal transition-colors duration-200 text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 2 — Elsewhere */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1">
              Elsewhere
            </p>
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone/75 hover:text-signal transition-colors duration-200 text-sm"
              >
                {label} ↗
              </a>
            ))}
          </div>

          {/* Column 3 — Say hello (right-aligned on md+) */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1">
              Say hello
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-bone/75 hover:text-signal transition-colors duration-200 text-sm break-all"
            >
              {personalInfo.email}
            </a>
            <p className="font-mono text-xs text-dim">
              {personalInfo.city}
            </p>
          </div>
        </div>

        {/* ── Giant watermark ───────────────────────────────────────────── */}
        <p
          className="text-center uppercase whitespace-nowrap font-bold leading-none tracking-[-0.05em] text-bone/[0.07] select-none mb-8"
          style={{ fontSize: '13.5vw' }}
          aria-hidden="true"
        >
          {personalInfo.brandName}
        </p>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div className="border-t border-bone/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
          {/* Left: copyright + tagline */}
          <p>
            © {year} {personalInfo.name} · {footerContent.tagline}
          </p>

          {/* Right: TAP Academy credit */}
          <p>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-signal transition-colors duration-200"
            >
              {academy.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

