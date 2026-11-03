// Contact.jsx — terminal-style contact form + left-hand contact info.
// Falls back to a mailto: link when EmailJS is not yet configured.

import { useRef, useState, useEffect } from 'react'
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

// Social links array — empty strings are filtered out and not shown.
const SOCIALS = [
  { label: 'GitHub',    href: socialLinks.github    },
  { label: 'LinkedIn',  href: socialLinks.linkedin   },
  { label: 'Instagram', href: socialLinks.instagram  },
].filter((s) => s.href)

/** True when all three EmailJS keys have been swapped out from the defaults. */
function isEmailJSConfigured() {
  const { serviceId, templateId, publicKey } = emailjsConfig
  return (
    serviceId  !== 'YOUR_EMAILJS_SERVICE_ID'  &&
    templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
    publicKey  !== 'YOUR_EMAILJS_PUBLIC_KEY'
  )
}

export default function Contact() {
  const formRef             = useRef(null)
  const clearTimer          = useRef(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'

  // Clear the auto-reset timer on unmount to avoid state updates after unmount
  useEffect(() => () => clearTimeout(clearTimer.current), [])

  // ── Form submission ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      if (isEmailJSConfigured()) {
        // Real send via EmailJS (dynamic import — keeps it out of main bundle)
        const emailjs = await import('@emailjs/browser')
        const { serviceId, templateId, publicKey } = emailjsConfig
        await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      } else {
        // Fallback: open a pre-filled mailto: link in a new tab
        const data    = new FormData(formRef.current)
        const name    = data.get('user_name')    ?? ''
        const email   = data.get('user_email')   ?? ''
        const message = data.get('message')      ?? ''
        const subject = encodeURIComponent('Portfolio contact')
        const body    = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\n${message}`,
        )
        window.open(
          `mailto:${personalInfo.email}?subject=${subject}&body=${body}`,
          '_blank',
        )
      }

      setStatus('success')
      formRef.current?.reset()
    } catch (err) {
      console.error('[Contact] Send failed:', err)
      setStatus('error')
    }

    // Auto-clear status after 4 s
    clearTimer.current = setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section
      id="contact"
      className="hud-grid w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20">

        {/* ── Left: contact info ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Section label */}
          <ScrambleText
            text={contactContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />

          {/* Heading */}
          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
            {contactContent.heading}
          </h2>

          {/* Note */}
          <p className="text-lg text-bone/70 max-w-md leading-relaxed">
            {contactContent.note}
          </p>

          {/* Email — thick signal underline */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-lg md:text-2xl text-bone underline decoration-signal decoration-2 underline-offset-8 hover:text-signal transition-colors duration-200 self-start"
          >
            {personalInfo.email}
          </a>

          {/* Phone — only if provided */}
          {personalInfo.phone && (
            <p className="font-mono text-sm text-dim">
              {personalInfo.phone}
            </p>
          )}

          {/* Social links */}
          {SOCIALS.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-2">
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors duration-200"
                >
                  {label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: terminal form ───────────────────────────────────────── */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10">

          {/* Terminal prompt line */}
          <p className="font-mono text-xs text-dim mb-8 select-none">
            <span className="text-signal">$</span>
            {' new message --to '}
            {personalInfo.name.split(' ')[0].toLowerCase()}
          </p>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="user_name" className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                &gt; name
              </label>
              <input
                id="user_name"
                name="user_name"
                required
                placeholder="Your full name"
                disabled={status === 'sending'}
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal outline-none font-mono text-sm text-bone placeholder:text-dim/50 py-2.5 transition-colors duration-200 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="user_email" className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                &gt; email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                disabled={status === 'sending'}
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal outline-none font-mono text-sm text-bone placeholder:text-dim/50 py-2.5 transition-colors duration-200 disabled:opacity-50"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="msg" className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                &gt; message
              </label>
              <textarea
                id="msg"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                disabled={status === 'sending'}
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal outline-none font-mono text-sm text-bone placeholder:text-dim/50 py-2.5 resize-none transition-colors duration-200 disabled:opacity-50"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-between bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
              <span className="text-base leading-none">→</span>
            </button>

            {/* Status line */}
            {status === 'success' && (
              <p role="status" className="font-mono text-xs text-emerald-400">
                ✓ Message sent. Talk soon.
              </p>
            )}
            {status === 'error' && (
              <p role="status" className="font-mono text-xs text-red-400">
                ✕ Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

