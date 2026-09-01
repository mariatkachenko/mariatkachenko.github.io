import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 3

type ZoomState = {
  scale: number
  x: number
  y: number
}

type PinchGesture = {
  distance: number
  centerX: number
  centerY: number
  start: ZoomState
}

function touchDistance(touches: React.TouchList) {
  const first = touches[0]
  const second = touches[1]
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY)
}

function touchCenter(touches: React.TouchList) {
  const first = touches[0]
  const second = touches[1]
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function useSlidePinchZoom(resetKey: unknown) {
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 })
  const gestureRef = useRef<PinchGesture | null>(null)
  const pinchedRef = useRef(false)

  useEffect(() => {
    setZoom({ scale: 1, x: 0, y: 0 })
    gestureRef.current = null
    pinchedRef.current = false
  }, [resetKey])

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2) return
    const center = touchCenter(event.touches)
    gestureRef.current = {
      distance: touchDistance(event.touches),
      centerX: center.x,
      centerY: center.y,
      start: zoom,
    }
    pinchedRef.current = true
  }

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.touches.length !== 2) return
    event.preventDefault()
    const center = touchCenter(event.touches)
    const nextScale = clamp(gesture.start.scale * (touchDistance(event.touches) / gesture.distance), MIN_SCALE, MAX_SCALE)
    setZoom({
      scale: nextScale,
      x: gesture.start.x + center.x - gesture.centerX,
      y: gesture.start.y + center.y - gesture.centerY,
    })
  }

  const onTouchEnd = () => {
    if (!gestureRef.current) return
    gestureRef.current = null
    setZoom((current) => current.scale <= 1.03 ? { scale: 1, x: 0, y: 0 } : current)
    window.setTimeout(() => {
      pinchedRef.current = false
    }, 0)
  }

  const consumePinchClick = () => {
    if (!pinchedRef.current) return false
    pinchedRef.current = false
    return true
  }

  const activeSlideStyle = zoom.scale === 1
    ? undefined
    : {
      transform: `translate3d(${zoom.x}px,${zoom.y}px,0) scale(${zoom.scale})`,
    } satisfies CSSProperties

  return {
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
    activeSlideStyle,
    isZoomed: zoom.scale > 1,
    consumePinchClick,
  }
}
