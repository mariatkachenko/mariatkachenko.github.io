import { useEffect, useRef } from 'react'
import { frameIndexAfterDirection, SCROLL_FRAME_URLS } from './scrollFrames'

const portraitAlt = 'Мария Ткаченко в серебристой куртке и розовых очках'

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  context.clearRect(0, 0, width, height)
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

export default function ScrollPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window.CanvasRenderingContext2D === 'undefined') return

    const context = canvas.getContext('2d')
    if (!context) return

    const imageCache = new Map<string, HTMLImageElement>()
    const frames = SCROLL_FRAME_URLS.map((url) => {
      const cachedImage = imageCache.get(url)
      if (cachedImage) return cachedImage

      const image = new Image()
      image.decoding = 'async'
      image.src = url
      imageCache.set(url, image)
      return image
    })
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let animationFrame = 0
    let currentFrame = -1
    let pendingDirection: -1 | 0 | 1 = 0
    let lastPointerX: number | null = null

    const render = () => {
      animationFrame = 0
      const ratio = window.devicePixelRatio || 1
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      const pixelWidth = Math.round(width * ratio)
      const pixelHeight = Math.round(height * ratio)
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        currentFrame = -1
      }

      const nextFrame = currentFrame < 0 ? 0 : pendingDirection ? frameIndexAfterDirection(currentFrame, frames.length, pendingDirection) : currentFrame
      pendingDirection = 0
      const image = frames[nextFrame]
      if (!image.complete || image.naturalWidth === 0) return

      drawCover(context, image, width, height)
      currentFrame = nextFrame
    }

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion) return
      if (lastPointerX === null) {
        lastPointerX = event.clientX
        return
      }
      const deltaX = event.clientX - lastPointerX
      lastPointerX = event.clientX
      if (Math.abs(deltaX) < 1) return
      pendingDirection = deltaX > 0 ? 1 : -1
      requestRender()
    }

    imageCache.forEach((image) => image.addEventListener('load', requestRender, { once: true }))
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('resize', requestRender)
    requestRender()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', requestRender)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <div className="maria-portrait-sequence">
    <img className="maria-portrait-fallback" src={SCROLL_FRAME_URLS[0]} alt={portraitAlt} />
    <canvas ref={canvasRef} className="maria-portrait-canvas" role="img" aria-label="Анимированный портрет Марии Ткаченко" />
  </div>
}
