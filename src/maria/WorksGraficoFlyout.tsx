import { useEffect, useRef } from 'react'

export default function WorksGraficoFlyout({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    if (active) {
      const playback = video.play()
      void playback?.catch(() => {})
      return
    }
    video.pause()
  }, [active])

  return <video
    ref={videoRef}
    className="works-grafico-flyout"
    src="/assets/maria/grafico.webm"
    muted
    loop
    playsInline
    preload="metadata"
    aria-hidden="true"
  />
}
