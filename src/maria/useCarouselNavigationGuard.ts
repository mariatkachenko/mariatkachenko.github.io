import { useEffect, type RefObject } from 'react'

const ROOT_GUARD_ATTRIBUTE = 'data-carousel-navigation-guard'

function pointInside(element: HTMLElement, x: number, y: number) {
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

export default function useCarouselNavigationGuard(carouselElement: RefObject<HTMLElement | null>) {
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
      setRootGuard(Boolean(carouselElement.current && pointInside(carouselElement.current, pointerX, pointerY)))
    }

    const preventHorizontalNavigation = (event: WheelEvent) => {
      if (event.deltaX === 0 || !carouselElement.current) return
      const pathTargetsCarousel = event.composedPath().includes(carouselElement.current)
      const eventHasCoordinates = event.clientX !== 0 || event.clientY !== 0
      const x = eventHasCoordinates ? event.clientX : pointerX
      const y = eventHasCoordinates ? event.clientY : pointerY
      if (pathTargetsCarousel || pointInside(carouselElement.current, x, y)) event.preventDefault()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('wheel', preventHorizontalNavigation, { capture: true, passive: false })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('wheel', preventHorizontalNavigation, { capture: true })
      setRootGuard(false)
    }
  }, [carouselElement])
}
