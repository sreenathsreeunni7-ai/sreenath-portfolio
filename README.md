# sreenath — Portfolio

A "Signal HUD" style developer portfolio — dark, technical and motion-led — built with React 19 and Vite.

**Live site:** https://YOUR-SITE-URL/ *(replace after deployment)*

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Animations | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| 3-D scene | three.js |
| Contact form | EmailJS |

## Run Locally

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

## Environment Variables

Create a `.env.local` file in the project root (git-ignored) and add:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Without these, the contact form falls back to opening a pre-filled `mailto:` link — no setup required.
