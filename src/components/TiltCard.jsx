import { useRef } from 'react'

// Su touch (iOS) niente tilt: il tap lascerebbe la card inclinata
const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Card con inclinazione 3D che segue il mouse + riflesso luminoso
export default function TiltCard({ children, className = '', max = 9 }) {
  const ref = useRef(null)
  const frame = useRef(0)

  const onMove = (event) => {
    const el = ref.current
    if (!el || !canHover()) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.transform =
        `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
        `rotateY(${(px * max).toFixed(2)}deg)`
      el.style.setProperty('--glow-x', `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--glow-y', `${((py + 0.5) * 100).toFixed(1)}%`)
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}
