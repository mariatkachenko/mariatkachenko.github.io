import { useEffect, type RefObject } from 'react'

const ROOT_GUARD_ATTRIBUTE = 'data-carousel-navigation-guard'

export function pointInside(element: HTMLElement, x: number, y: number) {
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

export type CarouselNavigationGuardHitTest = (element: HTMLElement, x: number, y: number, event: Event) => boolean

export default function useCarouselNavigationGuard(
  carouselElement: RefObject<HTMLElement | null>,
  hitTest: CarouselNavigationGuardHitTest = pointInside,
) {
  useEffect(() => {
    let pointerX = -1
    let pointerY = -1

    const setRootGuard = (active: boolean) => {
      if (active) document.documentElement.setAttribute(ROOT_GUARD_ATTRIBUTE, 'true')
      else document.documentElement.removeAttribute(ROOT_GUARD_ATTRIBUTE)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      setRootGuard(Boolean(carouselElement.current && hitTest(carouselElement.current, pointerX, pointerY, event)))
    }

    const preventHorizontalNavigation = (event: WheelEvent) => {
      if (event.deltaX === 0 || !carouselElement.current) return
      const eventHasCoordinates = event.clientX !== 0 || event.clientY !== 0
      const x = eventHasCoordinates ? event.clientX : pointerX
      const y = eventHasCoordinates ? event.clientY : pointerY
      if (hitTest(carouselElement.current, x, y, event)) event.preventDefault()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('wheel', preventHorizontalNavigation, { capture: true, passive: false })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('wheel', preventHorizontalNavigation, { capture: true })
      setRootGuard(false)
    }
  }, [carouselElement, hitTest])
}
