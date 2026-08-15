import { useEffect, useRef } from 'react'

type ShimmerParticle = {
  x: number
  y: number
  life: number
  size: number
  hue: number
  driftX: number
  driftY: number
}

export const SHIMMER_MAX_PARTICLE_SIZE = 3
export const SHIMMER_PARTICLE_SHAPE = 'pixel' as const

export function shouldEmitShimmer(_clientX: number, _viewportWidth: number) {
  return true
}

export default function ShimmerTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window.CanvasRenderingContext2D === 'undefined') return
    const context = canvas.getContext('2d')
    if (!context) return

    const particles: ShimmerParticle[] = []
    let animationFrame = 0
    let lastPoint: { x: number; y: number } | null = null

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(window.innerWidth * ratio)
      canvas.height = Math.round(window.innerHeight * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = () => {
      animationFrame = 0
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        particle.life -= 0.022
        if (particle.life <= 0) {
          particles.splice(index, 1)
          continue
        }

        particle.x += particle.driftX
        particle.y += particle.driftY
        context.fillStyle = `hsla(${particle.hue},100%,68%,${particle.life * 0.9})`
        context.fillRect(
          Math.round(particle.x - particle.size / 2),
          Math.round(particle.y - particle.size / 2),
          particle.size,
          particle.size,
        )
      }

      if (particles.length) animationFrame = window.requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!shouldEmitShimmer(event.clientX, window.innerWidth)) {
        lastPoint = null
        return
      }

      const previous = lastPoint ?? { x: event.clientX, y: event.clientY }
      const distance = Math.hypot(event.clientX - previous.x, event.clientY - previous.y)
      const count = Math.min(10, Math.max(3, Math.ceil(distance / 9)))
      for (let step = 1; step <= count; step += 1) {
        const progress = step / count
        for (let dust = 0; dust < 4; dust += 1) {
          particles.push({
            x: previous.x + (event.clientX - previous.x) * progress + (Math.random() - 0.5) * 22,
            y: previous.y + (event.clientY - previous.y) * progress + (Math.random() - 0.5) * 22,
            life: 0.7 + Math.random() * 0.3,
            size: 1 + Math.floor(Math.random() * SHIMMER_MAX_PARTICLE_SIZE),
            hue: 318 + Math.random() * 24,
            driftX: (Math.random() - 0.5) * 0.45,
            driftY: -0.15 - Math.random() * 0.35,
          })
        }
      }
      if (particles.length > 280) particles.splice(0, particles.length - 280)
      lastPoint = { x: event.clientX, y: event.clientY }
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="maria-shimmer-trail" aria-hidden="true" />
}
