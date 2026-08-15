import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WorksCardCarousel, {
  WORKS_CARD_COUNT,
  WORKS_AUTOPLAY_MS,
  WORKS_INITIAL_POSITION,
  WORKS_MOBILE_DRAG_STEP_PX,
  WORKS_MTS_PLACEHOLDER_INDEX,
  WORKS_PLACEHOLDER_COVERS,
  WORKS_PROJECT_INDEX,
  continuousWorksOffset,
  mobileWorksDeckPose,
  mobileWorksLoopPose,
  normalizeWorksPosition,
  worksPositionAfterDelta,
  worksDragReleasePosition,
  worksDragStep,
  worksCardFocus,
  worksCardGradient,
  worksPointerCoordinate,
  worksPatternOffset,
  worksWheelDelta,
  worksRowPose,
  visibleWorksCardIndices,
} from './WorksCardCarousel'

function renderReadyWorksCarousel(onOpen = vi.fn(), language: 'ru' | 'en' = 'ru') {
  vi.useFakeTimers()
  const result = render(<WorksCardCarousel onOpen={onOpen} language={language} />)
  act(() => vi.advanceTimersByTime(600))
  vi.useRealTimers()
  return result
}

describe('continuous works row geometry', () => {
  it('wraps fractional positions and keeps a straight equal row', () => {
    expect(WORKS_CARD_COUNT).toBe(14)
    expect(WORKS_PROJECT_INDEX).toBe(6)
    expect(WORKS_INITIAL_POSITION).toBe(WORKS_PROJECT_INDEX)
    expect(WORKS_MOBILE_DRAG_STEP_PX).toBe(140)
    expect(worksDragStep(false)).toBe(150)
    expect(worksDragStep(true)).toBe(140)
    expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, false)).toBe(20)
    expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, true)).toBe(80)
    expect(worksWheelDelta(10, 70, false, true)).toBe(70)
    expect(worksPatternOffset(0)).toEqual(worksPatternOffset(WORKS_CARD_COUNT))
    expect(worksPatternOffset(3.5)).toEqual({ desktopX: 2.4, desktopY: 0, mobileX: 0.8, mobileY: 0 })
    expect(worksPatternOffset(7)).toEqual({ desktopX: 0, desktopY: -0.8, mobileX: 0, mobileY: -1.8 })
    expect(normalizeWorksPosition(-0.5)).toBe(13.5)
    expect(continuousWorksOffset(0, 1.5)).toBe(-1.5)
    expect(continuousWorksOffset(13, 0.5)).toBe(-1.5)
    expect(worksPositionAfterDelta(0, -300, 150)).toBe(2)
    expect(worksDragReleasePosition(6.375)).toBe(6.375)
    expect(worksDragReleasePosition(14.25)).toBe(0.25)
    expect(worksDragReleasePosition(6.375, 14, true)).toBe(6)
    expect(worksDragReleasePosition(6.6, 14, true)).toBe(7)
    expect(worksDragReleasePosition(13.7, 14, true)).toBe(0)
    expect(worksRowPose(0).rotateY).toBe(0)
    expect(worksRowPose(-1).rotateY).toBe(30)
    expect(worksRowPose(1).rotateY).toBe(-30)
    expect(worksRowPose(-2).rotateY).toBe(60)
    expect(worksRowPose(2).rotateY).toBe(-60)
    expect(worksRowPose(-3).rotateY).toBe(72)
    expect(worksRowPose(3).rotateY).toBe(-72)
    expect(worksRowPose(0.5).rotateY).toBe(-15)
    expect(worksRowPose(0).layer).toBeGreaterThan(worksRowPose(1).layer)
    expect(mobileWorksLoopPose(0, 14)).toEqual({ y: 0, scale: 1, opacity: 1, layer: 20 })
    expect(mobileWorksLoopPose(3.5, 14).y).toBeCloseTo(22)
    expect(mobileWorksLoopPose(3.5, 14).scale).toBe(1)
    expect(mobileWorksLoopPose(7, 14)).toEqual({ y: 0, scale: 1, opacity: 0.18, layer: 1 })
    expect(mobileWorksLoopPose(-3.5, 14).y).toBeCloseTo(-22)
    expect(mobileWorksDeckPose(0)).toEqual({ y: 0, scale: 1, layer: 20 })
    expect(mobileWorksDeckPose(-0.5)).toEqual({ y: -3.25, scale: 0.97, layer: 18 })
    expect(mobileWorksDeckPose(0.5)).toEqual({ y: 3.25, scale: 0.97, layer: 18 })
    expect(mobileWorksDeckPose(-1)).toEqual({ y: -6.5, scale: 0.94, layer: 16 })
    expect(mobileWorksDeckPose(1)).toEqual({ y: 6.5, scale: 0.94, layer: 16 })
    expect(mobileWorksDeckPose(-2)).toEqual({ y: -13, scale: 0.88, layer: 12 })
    expect(mobileWorksDeckPose(2)).toEqual({ y: 13, scale: 0.88, layer: 12 })
    expect(worksCardFocus(0)).toEqual({ lightBrightness: 1, lightSaturation: 1, darkSaturation: 1, darkHue: 0, darkGlow: 0.18 })
    expect(worksCardFocus(1)).toEqual({ lightBrightness: 0.92, lightSaturation: 0.97, darkSaturation: 0.96, darkHue: -3, darkGlow: 0.09 })
    expect(worksCardFocus(2)).toEqual({ lightBrightness: 0.84, lightSaturation: 0.94, darkSaturation: 0.92, darkHue: -6, darkGlow: 0 })
    expect(worksCardFocus(5)).toEqual(worksCardFocus(2))
    expect(worksCardGradient(0)).toEqual({ strength: 0, desktopAngle: 90, mobileAngle: 180, mobileLowerDepth: 0 })
    expect(worksCardGradient(-1)).toEqual({ strength: 0.07, desktopAngle: 90, mobileAngle: 180, mobileLowerDepth: 0 })
    expect(worksCardGradient(1)).toEqual({ strength: 0.07, desktopAngle: 270, mobileAngle: 0, mobileLowerDepth: 0.008 })
    expect(worksCardGradient(-2)).toEqual({ strength: 0.14, desktopAngle: 90, mobileAngle: 180, mobileLowerDepth: 0 })
    expect(worksCardGradient(2)).toEqual({ strength: 0.14, desktopAngle: 270, mobileAngle: 0, mobileLowerDepth: 0.002 })
  })

  it('returns exactly five visible cards at integer and fractional positions', () => {
    expect([...visibleWorksCardIndices(6)]).toEqual([4, 5, 6, 7, 8])
    expect([...visibleWorksCardIndices(6.49)]).toEqual([4, 5, 6, 7, 8])
    expect([...visibleWorksCardIndices(6.5)]).toEqual([5, 6, 7, 8, 9])
    expect(visibleWorksCardIndices(13.8).size).toBe(5)
  })
})

describe('WorksCardCarousel', () => {
  it('reports a centered card only when the rounded center changes', () => {
    vi.useFakeTimers()
    try {
      const onCenteredIndexChange = vi.fn()
      render(<WorksCardCarousel
        onOpen={vi.fn()}
        onCenteredIndexChange={onCenteredIndexChange}
        language="ru"
      />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      expect(onCenteredIndexChange).toHaveBeenLastCalledWith(6)
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(1)
      act(() => vi.advanceTimersByTime(600))

      fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(1)

      fireEvent.wheel(carousel, { deltaX: 50, deltaY: 0 })
      expect(onCenteredIndexChange).toHaveBeenLastCalledWith(7)
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('advances one card at a relaxed autoplay interval after the entrance', () => {
    vi.useFakeTimers()
    try {
      render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      act(() => vi.advanceTimersByTime(600))
      expect(carousel).toHaveAttribute('data-works-position', '6')

      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS - 1))
      expect(carousel).toHaveAttribute('data-works-position', '6')

      act(() => vi.advanceTimersByTime(1))
      expect(carousel).toHaveAttribute('data-works-position', '7')

      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS))
      expect(carousel).toHaveAttribute('data-works-position', '8')
    } finally {
      vi.useRealTimers()
    }
  })

  it('starts as a compact stack, blocks interaction, and releases into the carousel', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
      const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')

      expect(carousel).toHaveClass('is-entering')
      expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-entry-index': '0' })
      expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-entry-lift-y': '0vh' })
      expect(cards[WORKS_PROJECT_INDEX - 1]).toHaveStyle({ '--works-entry-lift-y': '-1vh' })
      expect(cards[WORKS_PROJECT_INDEX - 2]).toHaveStyle({ '--works-entry-index': '2' })
      expect(cards[WORKS_PROJECT_INDEX - 2]).toHaveStyle({ '--works-entry-lift-y': '-3vh' })

      fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
      fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
      fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 120 })
      expect(carousel).toHaveAttribute('data-works-position', '6')

      act(() => vi.advanceTimersByTime(600))
      expect(carousel).not.toHaveClass('is-entering')
      fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '7')
    } finally {
      vi.useRealTimers()
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders equal structured cards without defective physical depth strips', () => {
    const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

    expect(cards).toHaveLength(14)
    expect(cards[WORKS_PROJECT_INDEX]).toHaveClass('has-project', 'is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
    expect(carousel).toHaveAttribute('data-works-position', '6')
    expect(cards[6]).toHaveAttribute('data-offset', '0')
    expect(cards[7]).toHaveAttribute('data-offset', '1')
    expect(screen.queryByText('MTS Pay')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.maria-works-deck-card__empty')).toHaveLength(13)
    expect(container.querySelectorAll('.works-project-card')).toHaveLength(12)
    expect(container.querySelectorAll('.works-project-card__media')).toHaveLength(12)
    expect(container.querySelectorAll('.works-project-card__footer')).toHaveLength(12)
    expect(container.querySelectorAll('.works-project-card__image')).toHaveLength(12)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelector('.mts-game-card')).not.toBeNull()
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelector('.works-project-card')).toBeNull()
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX]).toHaveClass('has-mts-game')
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__phones')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__artwork')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__girl')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__statue')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__footer')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.mts-project-card')).not.toBeNull()
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.works-project-card')).toBeNull()
    expect(screen.getByText('Концепт v3 — Преза')).toBeInTheDocument()
    expect(screen.getByText('Проект · МТС Финтех')).toBeInTheDocument()
    expect(screen.getAllByText('Новый проект')).toHaveLength(13)
    expect(screen.getAllByText('Скоро')).toHaveLength(13)
    expect(container.querySelectorAll('.maria-works-deck-card:not(.is-hidden)')).toHaveLength(5)
    expect(container.querySelectorAll('.maria-works-deck-card.is-hidden')).toHaveLength(9)
    expect(container.querySelectorAll('.maria-works-deck-card__spine')).toHaveLength(0)
    expect(container.querySelectorAll('.maria-works-deck-card__pages')).toHaveLength(0)
    expect(container.querySelectorAll('.works-project-card__file-icon')).toHaveLength(12)
    expect(container.querySelectorAll('.mts-game-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.mts-project-card__file-icon')).toHaveLength(1)
    const mtsFlags = container.querySelectorAll('.works-project-card__mts-flag')
    expect(mtsFlags).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-hanging-flag.png"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__media')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__artwork')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-live-triptych.png"]')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-cover.png"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__logo-flyout')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__butterfly-flyout')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-logo-flyout.png"]')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-butterfly-flyout.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('.works-corner-ribbon')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelector('.works-corner-ribbon')).not.toBeNull()
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.works-corner-ribbon')).toBeNull()
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelectorAll('.works-corner-ribbon__wrap')).toHaveLength(2)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelector('.works-corner-ribbon__tail')).not.toBeNull()
    expect(container.querySelectorAll('.works-grafico-flyout')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX + 3].querySelector('.works-grafico-flyout')).not.toBeNull()
    expect(cards[WORKS_PROJECT_INDEX + 2].querySelector('.works-grafico-flyout')).toBeNull()
    expect(container.querySelectorAll('.works-project-card__breakout-artwork')).toHaveLength(0)
    expect(cards[8].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[7].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[13].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-row-scale': '1' })
    expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-card-brightness-light': '1' })
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveStyle({ '--works-card-brightness-light': '0.92' })
    expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-card-dark-glow': '0.18' })
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveStyle({ '--works-card-dark-hue': '-3deg' })
    expect(cards[WORKS_PROJECT_INDEX + 2]).toHaveStyle({ '--works-card-saturation-dark': '0.92' })
    expect(cards[WORKS_PROJECT_INDEX]).toHaveStyle({ '--works-card-shade-strength': '0' })
    expect(cards[WORKS_PROJECT_INDEX - 1]).toHaveStyle({ '--works-card-shade-desktop-angle': '90deg' })
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveStyle({ '--works-card-shade-desktop-angle': '270deg' })
    expect(cards[WORKS_PROJECT_INDEX - 1]).toHaveStyle({ '--works-card-shade-mobile-angle': '180deg' })
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveStyle({ '--works-card-shade-mobile-angle': '0deg' })
    expect(cards[WORKS_PROJECT_INDEX - 1]).toHaveStyle({ '--works-card-mobile-lower-depth': '0' })
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveStyle({ '--works-card-mobile-lower-depth': '0.008' })
    expect(cards[WORKS_PROJECT_INDEX + 2]).toHaveStyle({ '--works-card-mobile-lower-depth': '0.002' })
    expect(cards[0]).toHaveStyle({ '--works-row-scale': '1' })
    expect(cards[0]).toHaveStyle({
      '--works-row-x': '-69vw',
    })
    expect(cards[0].style.getPropertyValue('--works-loop-y-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-loop-scale-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-loop-opacity-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-loop-layer-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-deck-y-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-deck-scale-mobile')).not.toBe('')
    expect(cards[0].style.getPropertyValue('--works-deck-opacity-mobile')).toBe('')
    expect(cards[0].style.getPropertyValue('--works-deck-layer-mobile')).not.toBe('')
    cards.forEach((card) => {
      expect(card).toHaveStyle({ '--works-loop-scale-mobile': '1' })
    })
    expect(
      Number.parseFloat(cards[6].style.getPropertyValue('--works-row-rotate-x-mobile'))
      + Number.parseFloat(cards[6].style.getPropertyValue('--works-row-rotate-y')),
    ).toBe(0)
  })

  it('cycles the five temporary covers across every placeholder card', () => {
    const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const images = [...container.querySelectorAll<HTMLImageElement>('.works-project-card__image')]
    const sources = images.map((image) => image.getAttribute('src'))

    expect(WORKS_PLACEHOLDER_COVERS).toHaveLength(5)
    expect(WORKS_PLACEHOLDER_COVERS[2]).toBe('/assets/maria/mts-pay-game-card.png')
    expect(images).toHaveLength(WORKS_CARD_COUNT - 2)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-live-triptych.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-game-card.png"]')).toHaveLength(2)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-phones.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-girl.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-statue.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-cover.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-stage.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-logo-flyout.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-butterfly-flyout.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-flex-artwork.png"]')).toHaveLength(0)
    WORKS_PLACEHOLDER_COVERS.forEach((source) => expect(sources).toContain(source))
  })

  it('renders localized English project-card metadata', () => {
    render(<WorksCardCarousel onOpen={vi.fn()} language="en" />)

    expect(screen.getByText('Concept v3 — Presentation')).toBeInTheDocument()
    expect(screen.getByText('Project · MTS Fintech')).toBeInTheDocument()
    expect(screen.getAllByText('New project')).toHaveLength(13)
    expect(screen.getAllByText('Coming soon')).toHaveLength(13)
  })

  it('prevents native card dragging', () => {
    const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const card = container.querySelector<HTMLElement>('.maria-works-deck-card')!
    expect(fireEvent.dragStart(card)).toBe(false)
  })

  it('follows desktop drag continuously and settles the nearest card on release', () => {
    const { container } = renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')

    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
    expect(fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 95 })).toBe(false)
    expect(carousel).toHaveAttribute('data-works-position', '8.167')
    expect(document.querySelectorAll('.maria-works-deck-card:not(.is-hidden)')).toHaveLength(5)
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 95 })
    expect(carousel).toHaveAttribute('data-works-position', '8')
    expect(cards[8]).toHaveClass('is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
  })

  it('follows a mobile vertical drag directly and settles the nearest card on release', () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query === '(max-width: 600px)',
    } as MediaQueryList)))
    renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

    fireEvent.pointerDown(carousel, { pointerId: 2, clientY: 400 })
    expect(fireEvent.pointerMove(carousel, { pointerId: 2, clientY: 280 })).toBe(false)
    expect(carousel).toHaveAttribute('data-works-position', '6.857')
    fireEvent.pointerUp(carousel, { pointerId: 2, clientY: 280 })
    expect(carousel).toHaveAttribute('data-works-position', '7')
  })

  it('accumulates small horizontal trackpad deltas and follows the nearest visual center', () => {
    const { container } = renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')
    const project = cards[WORKS_PROJECT_INDEX]

    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '6.167')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '6.333')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '6.5')
    expect(project).not.toHaveClass('is-centered')
    expect(cards[7]).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 1, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '6.507')
    expect(cards[7]).toHaveClass('is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
    fireEvent.wheel(carousel, { deltaX: -26, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '6.333')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 0, deltaY: 120 })
    expect(carousel).toHaveAttribute('data-works-position', '6.333')
  })

  it('settles horizontal trackpad movement to the nearest card after input pauses', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
      const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')

      fireEvent.wheel(carousel, { deltaX: 100, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '6.667')
      expect(carousel).toHaveClass('is-wheeling')
      act(() => vi.advanceTimersByTime(119))
      expect(carousel).toHaveAttribute('data-works-position', '6.667')
      act(() => vi.advanceTimersByTime(1))
      expect(carousel).toHaveAttribute('data-works-position', '7')
      expect(carousel).not.toHaveClass('is-wheeling')
      expect(cards[7]).toHaveClass('is-centered')
    } finally {
      vi.useRealTimers()
    }
  })

  it('restores the MTS centered state after a complete carousel loop', () => {
    const { container } = renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')
    const project = cards[WORKS_PROJECT_INDEX]

    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
    expect(project).not.toHaveClass('is-centered')
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveClass('is-centered')

    for (let step = 0; step < WORKS_CARD_COUNT - 1; step += 1) {
      fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
    }

    expect(carousel).toHaveAttribute('data-works-position', String(WORKS_PROJECT_INDEX))
    expect(project).toHaveClass('is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
  })

  it('tracks mobile vertical wheel directly and settles after the gesture', () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query === '(max-width: 600px)',
    } as MediaQueryList)))
    vi.useFakeTimers()
    try {
      render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      fireEvent.wheel(carousel, { deltaX: 0, deltaY: 100 })
      expect(carousel).toHaveAttribute('data-works-position', '6.667')
      expect(carousel).toHaveClass('is-wheeling')
      act(() => vi.advanceTimersByTime(120))
      expect(carousel).toHaveAttribute('data-works-position', '7')
      expect(carousel).not.toHaveClass('is-wheeling')
    } finally {
      vi.useRealTimers()
    }
  })

  it('blocks horizontal browser navigation only when the wheel event targets the carousel', () => {
    render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const dispatchHorizontalWheel = (target: EventTarget) => {
      const event = new WheelEvent('wheel', { deltaX: 120, bubbles: true, cancelable: true })
      target.dispatchEvent(event)
      return event.defaultPrevented
    }

    expect(dispatchHorizontalWheel(document.body)).toBe(false)
    expect(dispatchHorizontalWheel(carousel)).toBe(true)
    expect(dispatchHorizontalWheel(document.body)).toBe(false)
  })

  it('blocks a window-targeted navigation gesture when its coordinates are inside the carousel', () => {
    render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    vi.spyOn(carousel, 'getBoundingClientRect').mockReturnValue({
      left: 100, right: 900, top: 120, bottom: 620, width: 800, height: 500,
      x: 100, y: 120, toJSON: () => ({}),
    })

    const inside = new WheelEvent('wheel', {
      deltaX: 120, clientX: 450, clientY: 300, bubbles: true, cancelable: true,
    })
    window.dispatchEvent(inside)
    expect(inside.defaultPrevented).toBe(true)

    const outside = new WheelEvent('wheel', {
      deltaX: 120, clientX: 50, clientY: 40, bubbles: true, cancelable: true,
    })
    window.dispatchEvent(outside)
    expect(outside.defaultPrevented).toBe(false)
  })

  it('opens MTS Pay on click but suppresses a click after drag', () => {
    const onOpen = vi.fn()
    renderReadyWorksCarousel(onOpen)
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const project = screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })

    fireEvent.click(project)
    expect(onOpen).toHaveBeenCalledTimes(1)

    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 300 })
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 100 })
    fireEvent.click(project)
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
