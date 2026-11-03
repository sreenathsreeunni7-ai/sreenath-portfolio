// App.jsx — root component.
// Composition order per AGENTS.md:
//   Cursor → Hud → <main>( Hero, About, Projects, Journey, Contact ) → Footer
import useSmoothScroll from './hooks/useSmoothScroll'
import Cursor   from './components/Cursor'
import Hud      from './components/Hud'
import Hero     from './components/Hero'
import About    from './components/About'
import Projects from './components/Projects'
import Journey  from './components/Journey'
import Contact  from './components/Contact'
import Footer   from './components/Footer'

function App() {
  // Initialise Lenis smooth scroll + shared GSAP ticker loop
  useSmoothScroll()

  return (
    <>
      {/* Custom crosshair cursor (pointer devices only, respects reduced-motion) */}
      <Cursor />

      {/* Fixed top navigation / HUD bar */}
      <Hud />

      {/* Page sections — one <h1> is in Hero; all others use <h2> */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
