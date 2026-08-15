import { useEffect, useRef } from 'react'

const SECONDS_PER_PIXEL = 0.018

export function videoTimeAfterPointerDelta(currentTime: number, deltaX: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(duration, Math.max(0, currentTime + deltaX * SECONDS_PER_PIXEL))
}

export default function PointerVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let lastPointerX: number | null = null
    let pendingDelta = 0
    let animationFrame = 0

    const scrub = () => {
      animationFrame = 0
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      video.pause()
      video.currentTime = videoTimeAfterPointerDelta(video.currentTime, pendingDelta, video.duration)
      pendingDelta = 0
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (lastPointerX === null) {
        lastPointerX = event.clientX
        return
      }
      pendingDelta += event.clientX - lastPointerX
      lastPointerX = event.clientX
      if (!animationFrame && pendingDelta !== 0) animationFrame = window.requestAnimationFrame(scrub)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <video
    ref={videoRef}
    className="maria-pointer-video"
    src="/assets/maria/skater.mp4"
    aria-label="Фигуристка, управляемая движением курсора"
    muted
    playsInline
    preload="auto"
  />
}
