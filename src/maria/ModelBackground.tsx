import { createElement, useEffect, useRef } from 'react'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function cameraOrbitForPointer(normalizedX: number, normalizedY: number) {
  const theta = Math.round((0.5 - clamp01(normalizedX)) * 120)
  const verticalPosition = clamp01(normalizedY)
  const phi = Math.round(60 + verticalPosition * 30)
  const radius = Math.round(85 + verticalPosition * 40)
  return `${theta}deg ${phi}deg ${radius}%`
}

export default function ModelBackground() {
  const modelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const model = modelRef.current
    if (!model) return

    let animationFrame = 0
    let pointerX = 0.5
    let pointerY = 0.5

    const updateOrbit = () => {
      animationFrame = 0
      model.setAttribute('camera-orbit', cameraOrbitForPointer(pointerX, pointerY))
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / Math.max(1, window.innerWidth)
      pointerY = event.clientY / Math.max(1, window.innerHeight)
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateOrbit)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return createElement('model-viewer', {
    ref: modelRef,
    class: 'maria-model-viewer',
    src: '/assets/maria/astronaut-optimized.glb',
    alt: 'Интерактивная 3D-модель космонавта',
    loading: 'eager',
    reveal: 'auto',
    'camera-orbit': cameraOrbitForPointer(0.5, 0.5),
    'field-of-view': '28deg',
    'shadow-intensity': '0.45',
    'environment-image': 'neutral',
    'tone-mapping': 'neutral',
  })
}
