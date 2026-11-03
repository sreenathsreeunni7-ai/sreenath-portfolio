// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

// ── Identity ────────────────────────────────────────────────
export const personalInfo = {
  name:         'Sreenath',
  brandName:    'Sreenath',
  role:         'Data Analyst',
  city:         'Gudalur, India',
  timezone:     'Asia/Kolkata',          // IANA timezone for the live HUD clock
  email:        'sreenathsree842@gmail.com',
  phone:        '+91 63800 84337',
  availability: 'Open to internships & full-time roles',
}

// ── TAP Academy credit (used in Footer) ─────────────────────
export const academy = {
  name: 'TAP Academy',
  url:  'https://thetapacademy.com/',
}

// ── Social links (empty string = not shown) ──────────────────
export const socialLinks = {
  github:    'https://github.com/sreenathsreeunni7-ai',
  linkedin:  'https://www.linkedin.com/in/pg-sreenath-2b97823b6',
  instagram: '',
}

// ── Navigation (anchor links — no router) ───────────────────
export const navLinks = [
  { label: 'About',   href: '#about'   },
  { label: 'Work',    href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

// ── Hero section ─────────────────────────────────────────────
export const heroContent = {
  eyebrow: 'PORTFOLIO — 2026',
  intro:
    'I turn raw data into clear insights — with Python, SQL and BI tools.',
  statusLines: [
    'Analysing data with Python',
    'Building Power BI dashboards',
    'Learning advanced SQL',
  ],
  ctaPrimary:   { label: 'View projects', href: '#projects' },
  ctaSecondary: { label: 'Get in touch',  href: '#contact'  },
}

// ── About section ────────────────────────────────────────────
export const aboutContent = {
  label:   '01 / About',
  heading: 'Data-driven thinker. Insight-led decision maker.',
  paragraph:
    "I'm a Data Analyst with hands-on experience in Python, SQL and BI tools " +
    'like Power BI and Tableau. I enjoy digging into datasets, spotting patterns ' +
    'and communicating findings through clear dashboards and reports. ' +
    "I'm currently sharpening my skills through the placement training program " +
    'at TAP Academy.',
  stats: [
    { value: 5,  suffix: '+', label: 'Projects completed'   },
    { value: 8,  suffix: '',  label: 'Tools used regularly'  },
    { value: 3,  suffix: '+', label: 'Datasets analysed'     },
  ],
}

// ── Skills ───────────────────────────────────────────────────
export const skillGroups = [
  {
    title: 'Programming & Analytics',
    items: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'SQL'],
  },
  {
    title: 'Data Visualisation & BI',
    items: ['Power BI', 'Tableau', 'Microsoft Excel'],
  },
  {
    title: 'Business Tools',
    items: ['Tally ERP 9', 'MS Word', 'MS PowerPoint'],
  },
  {
    title: 'Core Competencies',
    items: [
      'Data Analysis & Reporting',
      'Business & Sales Management',
      'Marketing Management',
      'Team Collaboration',
    ],
  },
]

// ── Projects ─────────────────────────────────────────────────
export const projects = [
  {
    id:          'project-1',
    number:      '01',
    title:       'Mobile Usage Patterns Among College Students',
    description:
      "Research study analysing college students' mobile phone usage — " +
      'surveyed real users, identified behavioural patterns and presented ' +
      'data-backed conclusions using Python and Excel.',
    tags:        ['Python', 'Data Analysis', 'Research'],
    year:        '2026',
    liveUrl:     '',
    githubUrl:   '',
  },
]

// ── Journey / Timeline ───────────────────────────────────────
export const experience = [
  {
    period:      '2026 — Now',
    role:        'Placement Training — Data Analytics',
    org:         'TAP Academy',
    description:
      'Full-stack development, AI and augmented reality training with a ' +
      'focus on data analytics, Python and interview preparation.',
  },
  {
    period:      '2023 — 2026',
    role:        'B.Com (Computer Applications)',
    org:         'Govt. Arts & Science College',
    description:
      'Coursework in business management, accounting, marketing and ' +
      'computer applications including MS Office and Tally ERP 9.',
  },
]

// ── Contact section ──────────────────────────────────────────
export const contactContent = {
  label:   '04 / Contact',
  heading: "Let's build something.",
  note:
    'Have a role, a project or a question? Send a message — I reply within a day.',
}

// ── Footer ───────────────────────────────────────────────────
export const footerContent = {
  tagline: 'Designed & built by hand.',
}

// ── EmailJS (values come from .env.local, prefix VITE_) ──────
export const emailjsConfig = {
  serviceId:  import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_EMAILJS_SERVICE_ID',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID',
  publicKey:  import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_EMAILJS_PUBLIC_KEY',
}
