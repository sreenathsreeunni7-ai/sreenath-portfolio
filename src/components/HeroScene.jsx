// HeroScene.jsx
// Renders a live 3D "Signal Core" using Three.js inside its parent div.
// Contains: an icosahedron edge shell (signal orange), a bone point-cloud
// core, and a tilted orbit ring. Responds to mouse tilt and drag-spin.

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // ── Scene & Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 7

    // ── Group (holds all three objects) ─────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    // 1) Outer shell — signal-orange icosahedron edges
    const shellBaseGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const shellGeo     = new THREE.EdgesGeometry(shellBaseGeo)
    const shellMat     = new THREE.LineBasicMaterial({
      color:       0xff5b1f,
      transparent: true,
      opacity:     reducedMotion ? 0.9 : 0, // intro: fade in from 0
    })
    const shell = new THREE.LineSegments(shellGeo, shellMat)
    group.add(shell)

    // 2) Inner core — bone point cloud
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 4)
    const coreMat = new THREE.PointsMaterial({
      color:       0xe8e6df,
      size:        0.025,
      transparent: true,
      opacity:     0.8,
    })
    const core = new THREE.Points(coreGeo, coreMat)
    group.add(core)

    // 3) Orbit ring — 128-point ellipse, tilted around X
    const curve     = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, Math.PI * 2)
    const ringPts2D = curve.getPoints(128)
    const ringGeo   = new THREE.BufferGeometry().setFromPoints(
      ringPts2D.map((p) => new THREE.Vector3(p.x, p.y, 0)),
    )
    const ringMat = new THREE.LineBasicMaterial({
      color:       0xe8e6df,
      transparent: true,
      opacity:     0.18,
    })
    const ring      = new THREE.LineLoop(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.4
    group.add(ring)

    // ── Intro materialise (skip if reduced-motion) ───────────────────────────
    if (!reducedMotion) group.scale.setScalar(0.6)
    let introProgress = reducedMotion ? 1 : 0 // 0 → 1 over ~1 s

    // ── Interaction state ────────────────────────────────────────────────────
    const mouseTilt    = { x: 0, y: 0 }   // target tilt from mouse
    let   autoSpinY    = 0                 // accumulated auto-rotation
    let   dragVelocity = 0                 // current drag spin per frame
    let   isDragging   = false
    let   lastDragX    = 0

    // Tilt group toward mouse position
    const onPointerMove = (e) => {
      const nx =  (e.clientX / window.innerWidth)  * 2 - 1  // -1 … 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseTilt.y = nx * 0.4
      mouseTilt.x = ny * 0.25

      if (isDragging) {
        // Drag velocity: 0.01 rad per pixel of horizontal movement
        dragVelocity = (e.clientX - lastDragX) * 0.01
        lastDragX    = e.clientX
      }
    }

    const onPointerDown = (e) => {
      isDragging   = true
      lastDragX    = e.clientX
      dragVelocity = 0
    }

    const onPointerUp = () => {
      isDragging = false
      // velocity is kept and decays in the animation loop (momentum)
    }

    window.addEventListener('pointermove',            onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup',              onPointerUp)

    // ── Animation loop ───────────────────────────────────────────────────────
    let rafId     = null
    let isVisible = true

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (!isVisible) return

      // -- Intro ease-out (scale 0.6 → 1, shell opacity 0 → 0.9) -------------
      if (introProgress < 1) {
        introProgress      = Math.min(introProgress + 0.016, 1)
        const eased        = 1 - Math.pow(1 - introProgress, 3) // cubic ease-out
        group.scale.setScalar(0.6 + eased * 0.4)
        shellMat.opacity   = eased * 0.9
      }

      // -- Auto-spin (+0.0025 / frame on Y) ----------------------------------
      if (!reducedMotion) autoSpinY += 0.0025

      // -- Drag momentum (apply velocity, then decay it) ---------------------
      autoSpinY    += dragVelocity
      dragVelocity *= 0.92 // dampen toward 0

      // -- Ease group rotation toward (auto-spin + mouse tilt) ---------------
      group.rotation.y += (autoSpinY + mouseTilt.y - group.rotation.y) * 0.06
      group.rotation.x += (mouseTilt.x - group.rotation.x) * 0.06

      // -- Counter-rotate inner point cloud ----------------------------------
      core.rotation.y = -(performance.now() * 0.001) * 0.15

      renderer.render(scene, camera)
    }

    animate()

    // ── Pause rendering when scrolled off-screen ─────────────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { threshold: 0 },
    )
    observer.observe(container)

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()

      window.removeEventListener('pointermove',              onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup',               onPointerUp)
      window.removeEventListener('resize',                  onResize)

      // Dispose every geometry and material
      shellBaseGeo.dispose()
      shellGeo.dispose()
      shellMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()

      renderer.dispose()
      renderer.forceContextLoss()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  )
}

