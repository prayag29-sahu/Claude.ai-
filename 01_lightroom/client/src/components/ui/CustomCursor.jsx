import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  let mx = 0, my = 0, rx = 0, ry = 0

  useEffect(() => {
    const onMove = e => {
      mx = e.clientX; my = e.clientY
      if (dot.current) { dot.current.style.left = mx + 'px'; dot.current.style.top = my + 'px' }
    }
    const animate = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px' }
      requestAnimationFrame(animate)
    }
    document.addEventListener('mousemove', onMove)
    animate()
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dot} className="fixed w-3 h-3 bg-gold rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block" style={{transition:'width .2s,height .2s'}} />
      <div ref={ring} className="fixed w-9 h-9 border border-gold/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block" />
    </>
  )
}
