import { useEffect, useRef } from 'react'

export function videoTimeForProgress(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(1, Math.max(0, progress)) * duration
}

export function shouldAutoplayAtScrollOffset(scrollOffset: number, viewportHeight: number) {
  return viewportHeight > 0 && Math.max(0, scrollOffset) < viewportHeight
}

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const page = video?.closest<HTMLElement>('.maria-page')
    if (!video || !page) return

    let animationFrame = 0
    let resumeTimer: number | undefined
    const syncVideoToScroll = () => {
      animationFrame = 0
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const bounds = page.getBoundingClientRect()
      const scrollRange = Math.max(1, bounds.height - window.innerHeight)
      const progress = -bounds.top / scrollRange
      const targetTime = videoTimeForProgress(progress, video.duration)
      if (Math.abs(video.currentTime - targetTime) > 1 / 120) video.currentTime = targetTime
    }
    const requestSync = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(syncVideoToScroll)
    }
    const settlePlayback = () => {
      const scrollOffset = -page.getBoundingClientRect().top
      if (shouldAutoplayAtScrollOffset(scrollOffset, window.innerHeight)) {
        if (video.paused) void video.play().catch(() => undefined)
      } else if (!video.paused) {
        video.pause()
      }
    }
    const handleScroll = () => {
      if (!video.paused) video.pause()
      requestSync()
      if (resumeTimer) window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(settlePlayback, 180)
    }
    const handleMetadata = () => {
      requestSync()
      settlePlayback()
    }

    video.addEventListener('loadedmetadata', handleMetadata)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', requestSync)
    requestSync()

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', requestSync)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (resumeTimer) window.clearTimeout(resumeTimer)
    }
  }, [])

  return <video
    ref={videoRef}
    className="maria-background-video"
    src="/assets/maria/background-video.mp4"
    aria-label="Фоновое видео портфолио Марии Ткаченко"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
  />
}
