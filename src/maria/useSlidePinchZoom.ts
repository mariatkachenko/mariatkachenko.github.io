import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 3

type ZoomState = {
  scale: number
  x: number
  y: number
}

type PinchState = {
  distance: number
  centerX: number
  centerY: number
  zoom: ZoomState
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function distance(first: PointerEvent, second: PointerEvent) {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY)
}

function center(first: PointerEvent, second: PointerEvent) {
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  }
}

export default function useSlidePinchZoom(resetKey: unknown) {
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 })
  const pointersRef = useRef(new Map<number, PointerEvent>())
  const pinchRef = useRef<PinchState | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setZoom({ scale: 1, x: 0, y: 0 })
    pointersRef.current.clear()
    pinchRef.current = null
    suppressClickRef.current = false
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current)
    suppressClickTimerRef.current = null
  }, [resetKey])

  const beginPinch = () => {
    const pointers = Array.from(pointersRef.current.values())
    if (pointers.length < 2) return
    const [first, second] = pointers
    const pinchCenter = center(first, second)
    pinchRef.current = {
      distance: distance(first, second),
      centerX: pinchCenter.x,
      centerY: pinchCenter.y,
      zoom,
    }
    suppressClickRef.current = true
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pointersRef.current.set(event.pointerId, event.nativeEvent)
    if (pointersRef.current.size === 2) {
      event.preventDefault()
      event.stopPropagation()
      beginPinch()
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || !pointersRef.current.has(event.pointerId)) return
    pointersRef.current.set(event.pointerId, event.nativeEvent)
    const pointers = Array.from(pointersRef.current.values())
    const pinch = pinchRef.current
    if (!pinch || pointers.length < 2) return

    event.preventDefault()
    event.stopPropagation()

    const [first, second] = pointers
    const pinchCenter = center(first, second)
    const nextScale = clamp(pinch.zoom.scale * distance(first, second) / pinch.distance, MIN_SCALE, MAX_SCALE)
    setZoom({
      scale: nextScale,
      x: pinch.zoom.x + pinchCenter.x - pinch.centerX,
      y: pinch.zoom.y + pinchCenter.y - pinch.centerY,
    })
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return
    pointersRef.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    setZoom((current) => current.scale <= 1.03 ? { scale: 1, x: 0, y: 0 } : current)
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current)
    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      suppressClickTimerRef.current = null
    }, 420)
  }

  const consumeClick = () => {
    if (!suppressClickRef.current) return false
    suppressClickRef.current = false
    return true
  }

  const zoomStyle = zoom.scale === 1
    ? undefined
    : {
      transform: `translate3d(${zoom.x}px,${zoom.y}px,0) scale(${zoom.scale})`,
    } satisfies CSSProperties

  return {
    isZoomed: zoom.scale > 1,
    consumeClick,
    zoomStyle,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  }
}
