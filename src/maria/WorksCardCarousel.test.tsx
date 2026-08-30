import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WorksCardCarousel, {
  WORKS_CARD_COUNT,
  WORKS_AUTOPLAY_MS,
  WORKS_AUTOPAY_INDEX,
  WORKS_ENTRY_DURATION_MS,
  WORKS_INITIAL_POSITION,
  WORKS_MOBILE_DRAG_STEP_PX,
  WORKS_MOBILE_WHEEL_STEP_PX,
  WORKS_MTS_PLACEHOLDER_INDEX,
  WORKS_PLACEHOLDER_COVERS,
  WORKS_PROJECT_INDEX,
  WORKS_RARIBLE_INDEX,
  WORKS_SBP_INDEX,
  WORKS_TINNOTECH_INDEX,
  WORKS_WALLET_INDEX,
  WORKS_WHEEL_SETTLE_DELAY_MS,
  WORKS_WHEEL_STEP_PX,
  continuousWorksOffset,
  mobileWorksDeckPose,
  mobileWorksLoopPose,
  normalizeWorksPosition,
  shouldLoadDeferredWorksArtwork,
  shouldLoadVisibleWorksArtwork,
  worksPositionAfterDelta,
  worksDragReleasePosition,
  worksDesktopRowX,
  worksDragStep,
  worksCardFocus,
  worksCardGradient,
  worksPointerCoordinate,
  worksPatternOffset,
  worksWheelDelta,
  worksWheelStep,
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
    expect(WORKS_CARD_COUNT).toBe(11)
    expect(WORKS_PROJECT_INDEX).toBe(4)
    expect(WORKS_INITIAL_POSITION).toBe(WORKS_PROJECT_INDEX)
    expect(WORKS_MOBILE_DRAG_STEP_PX).toBe(140)
    expect(worksDragStep(false)).toBe(150)
    expect(worksDragStep(true)).toBe(140)
    expect(WORKS_WHEEL_STEP_PX).toBe(220)
    expect(WORKS_MOBILE_WHEEL_STEP_PX).toBe(200)
    expect(worksWheelStep(false)).toBe(220)
    expect(worksWheelStep(true)).toBe(200)
    expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, false)).toBe(20)
    expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, true)).toBe(80)
    expect(worksWheelDelta(10, 70, false, true)).toBe(70)
    expect(worksPatternOffset(0)).toEqual(worksPatternOffset(WORKS_CARD_COUNT))
    expect(worksPatternOffset(3.5)).toEqual({ desktopX: 2.183, desktopY: -0.332, mobileX: 0.728, mobileY: -0.748 })
    expect(worksPatternOffset(7)).toEqual({ desktopX: -1.814, desktopY: -0.524, mobileX: -0.605, mobileY: -1.179 })
    expect(normalizeWorksPosition(-0.5)).toBe(10.5)
    expect(continuousWorksOffset(0, 1.5)).toBe(-1.5)
    expect(continuousWorksOffset(13, 0.5)).toBe(1.5)
    expect(worksPositionAfterDelta(0, -300, 150)).toBe(2)
    expect(worksDragReleasePosition(6.375)).toBe(6.375)
    expect(worksDragReleasePosition(14.25)).toBe(3.25)
    expect(worksDragReleasePosition(6.375, WORKS_CARD_COUNT, true)).toBe(6)
    expect(worksDragReleasePosition(6.6, WORKS_CARD_COUNT, true)).toBe(7)
    expect(worksDragReleasePosition(13.7, WORKS_CARD_COUNT, true)).toBe(3)
    expect(worksRowPose(0).rotateY).toBe(0)
    expect(worksRowPose(-1).rotateY).toBe(36)
    expect(worksRowPose(1).rotateY).toBe(-36)
    expect(worksRowPose(-2).rotateY).toBe(72)
    expect(worksRowPose(2).rotateY).toBe(-72)
    expect(worksRowPose(-3).rotateY).toBe(80)
    expect(worksRowPose(3).rotateY).toBe(-80)
    expect(worksRowPose(0.5).rotateY).toBe(-18)
    expect(shouldLoadDeferredWorksArtwork(1)).toBe(true)
    expect(shouldLoadDeferredWorksArtwork(-1)).toBe(true)
    expect(shouldLoadDeferredWorksArtwork(1.001)).toBe(false)
    expect(shouldLoadVisibleWorksArtwork(2)).toBe(true)
    expect(shouldLoadVisibleWorksArtwork(-2)).toBe(true)
    expect(shouldLoadVisibleWorksArtwork(2.001)).toBe(false)
    expect(worksDesktopRowX(0)).toBe(0)
    expect(worksDesktopRowX(-1)).toBe(-8.25)
    expect(worksDesktopRowX(1)).toBe(8.25)
    expect(worksDesktopRowX(-2)).toBe(-18.75)
    expect(worksDesktopRowX(2)).toBe(18.75)
    expect(worksRowPose(0).layer).toBeGreaterThan(worksRowPose(1).layer)
    expect(mobileWorksLoopPose(0, WORKS_CARD_COUNT)).toEqual({ y: 0, scale: 1, opacity: 1, layer: 20 })
    expect(mobileWorksLoopPose(3.5, WORKS_CARD_COUNT).y).toBeCloseTo(20.012)
    expect(mobileWorksLoopPose(3.5, WORKS_CARD_COUNT).scale).toBe(1)
    expect(mobileWorksLoopPose(5, WORKS_CARD_COUNT)).toEqual({ y: 6.198116250511461, scale: 1, opacity: 0.1966078808180561, layer: 1 })
    expect(mobileWorksLoopPose(-3.5, WORKS_CARD_COUNT).y).toBeCloseTo(-20.012)
    expect(mobileWorksDeckPose(0)).toEqual({ y: 0, scale: 1, layer: 20 })
    expect(mobileWorksDeckPose(-0.5)).toEqual({ y: -2.708, scale: 0.97, layer: 18 })
    expect(mobileWorksDeckPose(0.5)).toEqual({ y: 2.708, scale: 0.97, layer: 18 })
    expect(mobileWorksDeckPose(-1)).toEqual({ y: -5.417, scale: 0.94, layer: 16 })
    expect(mobileWorksDeckPose(1)).toEqual({ y: 5.417, scale: 0.94, layer: 16 })
    expect(mobileWorksDeckPose(-2)).toEqual({ y: -10.834, scale: 0.88, layer: 12 })
    expect(mobileWorksDeckPose(2)).toEqual({ y: 10.834, scale: 0.88, layer: 12 })
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
    expect([...visibleWorksCardIndices(4)]).toEqual([2, 3, 4, 5, 6])
    expect([...visibleWorksCardIndices(4.49)]).toEqual([2, 3, 4, 5, 6])
    expect([...visibleWorksCardIndices(4.5)]).toEqual([3, 4, 5, 6, 7])
    expect(visibleWorksCardIndices(9.8).size).toBe(5)
  })
})

describe('WorksCardCarousel', () => {
  it('waits for the route gate, then runs and completes the entrance once', () => {
    vi.useFakeTimers()
    try {
      const onEntryComplete = vi.fn()
      const { rerender } = render(<WorksCardCarousel onOpen={vi.fn()} entryReady={false} onEntryComplete={onEntryComplete} language="ru" />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      expect(carousel).toHaveClass('is-entering')
      expect(carousel).not.toHaveClass('is-entry-active')
      act(() => vi.advanceTimersByTime(700))
      expect(carousel).toHaveClass('is-entering')
      expect(onEntryComplete).not.toHaveBeenCalled()

      rerender(<WorksCardCarousel onOpen={vi.fn()} entryReady onEntryComplete={onEntryComplete} language="ru" />)
      expect(carousel).toHaveClass('is-entry-active')
      act(() => vi.advanceTimersByTime(599))
      expect(carousel).toHaveClass('is-entering')
      expect(onEntryComplete).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(1))
      expect(carousel).not.toHaveClass('is-entering')
      expect(onEntryComplete).toHaveBeenCalledOnce()
    } finally {
      vi.useRealTimers()
    }
  })

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

      expect(onCenteredIndexChange).toHaveBeenLastCalledWith(4)
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(1)
      act(() => vi.advanceTimersByTime(600))

      fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(1)

      fireEvent.wheel(carousel, { deltaX: 100, deltaY: 0 })
      expect(onCenteredIndexChange).toHaveBeenLastCalledWith(5)
      expect(onCenteredIndexChange).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('advances one card at a relaxed autoplay interval after the entrance', () => {
    vi.useFakeTimers()
    try {
      expect(WORKS_AUTOPLAY_MS).toBe(4800)
      render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      act(() => vi.advanceTimersByTime(600))
      expect(carousel).toHaveAttribute('data-works-position', '4')

      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS - 1))
      expect(carousel).toHaveAttribute('data-works-position', '4')

      act(() => vi.advanceTimersByTime(1))
      expect(carousel).toHaveAttribute('data-works-position', '5')

      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS))
      expect(carousel).toHaveAttribute('data-works-position', '6')
    } finally {
      vi.useRealTimers()
    }
  })

  it('freezes autoplay and manual navigation while a presentation is open', () => {
    vi.useFakeTimers()
    try {
      const { rerender } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      rerender(<WorksCardCarousel onOpen={vi.fn()} language="ru" paused />)
      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      fireEvent.pointerDown(carousel, { pointerId: 7, clientX: 420 })
      fireEvent.pointerMove(carousel, { pointerId: 7, clientX: 120 })
      fireEvent.pointerUp(carousel, { pointerId: 7, clientX: 120 })
      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS * 2))
      expect(carousel).toHaveAttribute('data-works-position', '4')

      rerender(<WorksCardCarousel onOpen={vi.fn()} language="ru" paused={false} />)
      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS - 1))
      expect(carousel).toHaveAttribute('data-works-position', '4')
      act(() => vi.advanceTimersByTime(1))
      expect(carousel).toHaveAttribute('data-works-position', '5')
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

      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
      fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 120 })
      expect(carousel).toHaveAttribute('data-works-position', '4')

      act(() => vi.advanceTimersByTime(600))
      expect(carousel).not.toHaveClass('is-entering')
      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '5')
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

    expect(cards).toHaveLength(11)
    expect(cards[WORKS_PROJECT_INDEX]).toHaveClass('has-project', 'is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
    expect(carousel).toHaveAttribute('data-works-position', '4')
    expect(cards[4]).toHaveAttribute('data-offset', '0')
    expect(cards[5]).toHaveAttribute('data-offset', '1')
    expect(screen.queryByText('MTS Pay')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.maria-works-deck-card__empty')).toHaveLength(6)
    expect(container.querySelectorAll('.works-project-card')).toHaveLength(3)
    expect(container.querySelectorAll('.works-project-card__media')).toHaveLength(3)
    expect(container.querySelectorAll('.works-project-card__footer')).toHaveLength(3)
    expect(container.querySelectorAll('.works-project-card__image')).toHaveLength(3)
    expect(cards[WORKS_RARIBLE_INDEX]).toHaveClass('has-rarible')
    expect(cards[WORKS_RARIBLE_INDEX].querySelector('.rarible-project-card')).not.toBeNull()
    expect(cards[WORKS_RARIBLE_INDEX].querySelectorAll('.rarible-project-card__cover')).toHaveLength(1)
    expect(cards[WORKS_RARIBLE_INDEX].querySelectorAll('.rarible-project-card__ape')).toHaveLength(1)
    expect(cards[WORKS_RARIBLE_INDEX].querySelectorAll('.rarible-project-card__logo')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelector('.mts-game-card')).not.toBeNull()
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelector('.works-project-card')).toBeNull()
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX]).toHaveClass('has-mts-game')
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__phones')).toHaveLength(0)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__artwork')).toHaveLength(1)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__girl')).toHaveLength(0)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__statue')).toHaveLength(0)
    expect(cards[WORKS_MTS_PLACEHOLDER_INDEX].querySelectorAll('.mts-game-card__footer')).toHaveLength(1)
    expect(cards[WORKS_TINNOTECH_INDEX].querySelector('.tinnotech-project-card')).not.toBeNull()
    expect(cards[WORKS_TINNOTECH_INDEX].querySelector('.works-project-card')).toBeNull()
    expect(cards[WORKS_TINNOTECH_INDEX]).toHaveClass('has-tinnotech')
    expect(cards[WORKS_TINNOTECH_INDEX].querySelectorAll('.tinnotech-project-card__phones')).toHaveLength(0)
    expect(cards[WORKS_TINNOTECH_INDEX].querySelectorAll('.tinnotech-project-card__footer')).toHaveLength(1)
    expect(cards[WORKS_WALLET_INDEX].querySelector('.wallet-project-card')).not.toBeNull()
    expect(cards[WORKS_WALLET_INDEX]).toHaveClass('has-wallet')
    expect(cards[WORKS_WALLET_INDEX].querySelectorAll('.wallet-project-card__phones')).toHaveLength(0)
    expect(screen.getByText('anyExcuse, Дублин 2021')).toBeInTheDocument()
    expect(cards[WORKS_AUTOPAY_INDEX]).toHaveClass('has-autopay')
    expect(cards[WORKS_AUTOPAY_INDEX].querySelector('.autopay-project-card')).not.toBeNull()
    expect(cards[WORKS_AUTOPAY_INDEX].querySelectorAll('.autopay-project-card__phones')).toHaveLength(0)
    expect(cards[WORKS_SBP_INDEX]).toHaveClass('has-sbp')
    expect(cards[WORKS_SBP_INDEX].querySelector('.sbp-project-card')).not.toBeNull()
    expect(cards[WORKS_SBP_INDEX].querySelector('.maria-works-deck-card__empty')).toBeNull()
    expect(cards[WORKS_SBP_INDEX].querySelectorAll('.sbp-project-card__phones')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveClass('has-aliexpress')
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelector('.aliexpress-project-card')).not.toBeNull()
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelectorAll('.aliexpress-project-card__phones')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelectorAll('.aliexpress-project-card__bag')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelectorAll('.aliexpress-project-card__heart')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelectorAll('.aliexpress-project-card__sparkles')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.mts-project-card')).not.toBeNull()
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.works-project-card')).toBeNull()
    expect(screen.getByText('МТС Pay редизайн')).toBeInTheDocument()
    expect(screen.getByText('МТС Финтех 2026')).toBeInTheDocument()
    expect(screen.getByText('Благотворительность Rarible')).toBeInTheDocument()
    expect(screen.getByText('Phystech Business Solutions')).toBeInTheDocument()
    expect(screen.getByText('Коллекции AliExpress')).toBeInTheDocument()
    expect(screen.getByText('AliExpress DAU Hackathon')).toBeInTheDocument()
    expect(screen.getAllByText('Новый проект')).toHaveLength(3)
    expect(screen.getAllByText('Скоро')).toHaveLength(3)
    expect(container.querySelectorAll('.maria-works-deck-card:not(.is-hidden)')).toHaveLength(5)
    expect(container.querySelectorAll('.maria-works-deck-card.is-hidden')).toHaveLength(6)
    expect(container.querySelectorAll('.maria-works-deck-card__spine')).toHaveLength(0)
    expect(container.querySelectorAll('.maria-works-deck-card__pages')).toHaveLength(0)
    expect(container.querySelectorAll('.works-project-card__file-icon')).toHaveLength(3)
    expect(container.querySelectorAll('.rarible-project-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.aliexpress-project-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.mts-game-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.tinnotech-project-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.mts-project-card__file-icon')).toHaveLength(1)
    expect(container.querySelectorAll('.sbp-project-card .wallet-project-card__file-icon')).toHaveLength(1)
    const mtsFlags = container.querySelectorAll('.works-project-card__mts-flag')
    expect(mtsFlags).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-hanging-flag.png"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__media')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__artwork')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-card-composition-crisp.png"]')).toHaveLength(1)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-cover.png"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__logo-flyout')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.mts-project-card__butterfly-flyout')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-logo-flyout.webp"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('img[src="/assets/maria/mts-pay-butterfly-flyout.webp"]')).toHaveLength(0)
    expect(cards[WORKS_PROJECT_INDEX + 1].querySelector('img[src="/assets/maria/aliexpress-bag.webp"]')).not.toBeNull()
    expect(container.querySelectorAll('.works-project-card__breakout-artwork')).toHaveLength(0)
    expect(cards[7].querySelector('.works-project-card__mts-flag')).toBeNull()
    expect(cards[9].querySelector('.works-project-card__mts-flag')).toBeNull()
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
    expect(cards[0]).toHaveStyle({ '--works-row-scale': '1.1' })
    expect(cards[0]).toHaveStyle({
      '--works-row-x': '-39.75vw',
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
      Number.parseFloat(cards[4].style.getPropertyValue('--works-row-rotate-x-mobile'))
      + Number.parseFloat(cards[4].style.getPropertyValue('--works-row-rotate-y')),
    ).toBe(0)
  })

  it('reuses one identical temporary cover and defers distant MTS game artwork', () => {
    const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
    const images = [...container.querySelectorAll<HTMLImageElement>('.works-project-card__image')]
    const sources = images.map((image) => image.getAttribute('src'))

    expect(WORKS_PLACEHOLDER_COVERS).toEqual([
      '/assets/maria/works-placeholder-payments-a.webp',
    ])
    expect(images).toHaveLength(WORKS_CARD_COUNT - 8)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-card-composition-crisp.png"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/works-placeholder-payments-a.webp"]')).toHaveLength(3)
    expect(container.querySelectorAll('img[src="/assets/maria/works-placeholder-payments-b.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/aliexpress-bag.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/aliexpress-collections-cover.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/aliexpress-heart.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/aliexpress-sparkles.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/rarible-charity-cover.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-game-card.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-phones.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-girl.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-game-statue.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/tinnotech-phones.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/tinnotech-chat.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/tinnotech-poll.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/tinnotech-logo.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-cover.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-stage.png"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-logo-flyout.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-butterfly-flyout.webp"]')).toHaveLength(0)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-flex-artwork.png"]')).toHaveLength(0)
    expect(sources).not.toContain('/assets/maria/rarible-charity-cover.webp')
  })

  it('loads the deferred MTS game layers one position before the card reaches center', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      expect(container.querySelectorAll('.mts-game-card__artwork img')).toHaveLength(0)

      act(() => vi.advanceTimersByTime(WORKS_ENTRY_DURATION_MS))
      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS))

      expect(container.querySelectorAll('.mts-game-card__artwork img')).toHaveLength(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('unmounts heavy artwork only after a project leaves the five-card visible window', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      expect(container.querySelectorAll('.mts-project-card__artwork')).toHaveLength(1)
      expect(container.querySelectorAll('.rarible-project-card__artwork img')).toHaveLength(3)
      expect(container.querySelectorAll('.aliexpress-project-card__artwork img')).toHaveLength(4)

      act(() => vi.advanceTimersByTime(WORKS_ENTRY_DURATION_MS))
      act(() => vi.advanceTimersByTime(WORKS_AUTOPLAY_MS * 3))

      expect(container.querySelectorAll('.mts-project-card__artwork')).toHaveLength(0)
      expect(container.querySelectorAll('.rarible-project-card__artwork img')).toHaveLength(0)
      expect(container.querySelectorAll('.aliexpress-project-card__artwork img')).toHaveLength(4)
      expect(container.querySelectorAll('.tinnotech-project-card__artwork img')).toHaveLength(4)
    } finally {
      vi.useRealTimers()
    }
  })

  it('renders localized English project-card metadata', () => {
    render(<WorksCardCarousel onOpen={vi.fn()} language="en" />)

    expect(screen.getByText('MTS Pay Redesign')).toBeInTheDocument()
    expect(screen.getByText('MTS Fintech 2026')).toBeInTheDocument()
    expect(screen.getByText('Rarible Charity Program')).toBeInTheDocument()
    expect(screen.getByText('Phystech Business Solutions')).toBeInTheDocument()
    expect(screen.getByText('AliExpress Collections')).toBeInTheDocument()
    expect(screen.getByText('AliExpress DAU Hackathon')).toBeInTheDocument()
    expect(screen.getByText('anyExcuse, Dublin 2021')).toBeInTheDocument()
    expect(screen.getAllByText('New project')).toHaveLength(3)
    expect(screen.getAllByText('Coming soon')).toHaveLength(3)
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
    expect(carousel).toHaveAttribute('data-works-position', '6.167')
    expect(document.querySelectorAll('.maria-works-deck-card:not(.is-hidden)')).toHaveLength(5)
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 95 })
    expect(carousel).toHaveAttribute('data-works-position', '6')
    expect(cards[6]).toHaveClass('is-centered')
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
    expect(carousel).toHaveAttribute('data-works-position', '4.857')
    fireEvent.pointerUp(carousel, { pointerId: 2, clientY: 280 })
    expect(carousel).toHaveAttribute('data-works-position', '5')
  })

  it('accumulates small horizontal trackpad deltas and follows the nearest visual center', () => {
    const { container } = renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')
    const project = cards[WORKS_PROJECT_INDEX]

    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.114')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.227')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.341')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.455')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.568')
    expect(project).not.toHaveClass('is-centered')
    expect(cards[5]).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 1, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.573')
    expect(cards[5]).toHaveClass('is-centered')
    expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
    fireEvent.wheel(carousel, { deltaX: -76, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-works-position', '4.227')
    expect(project).toHaveClass('is-centered')
    fireEvent.wheel(carousel, { deltaX: 0, deltaY: 120 })
    expect(carousel).toHaveAttribute('data-works-position', '4.227')
  })

  it('settles horizontal trackpad movement to the nearest card after input pauses', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
      const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')

      fireEvent.wheel(carousel, { deltaX: 120, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '4.545')
      expect(carousel).toHaveClass('is-wheeling')
      act(() => vi.advanceTimersByTime(119))
      expect(carousel).toHaveAttribute('data-works-position', '4.545')
      act(() => vi.advanceTimersByTime(1))
      expect(carousel).toHaveAttribute('data-works-position', '5')
      expect(carousel).not.toHaveClass('is-wheeling')
      expect(cards[5]).toHaveClass('is-centered')
    } finally {
      vi.useRealTimers()
    }
  })

  it('limits one continuous horizontal wheel gesture to one project', () => {
    vi.useFakeTimers()
    try {
      render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
      fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
      fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '5')

      act(() => vi.advanceTimersByTime(120))
      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '6')
    } finally {
      vi.useRealTimers()
    }
  })

  it('starts a new wheel gesture when a fresh impulse follows the inertial tail', () => {
    vi.useFakeTimers()
    try {
      render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      expect(carousel).toHaveAttribute('data-works-position', '5')
      fireEvent.wheel(carousel, { deltaX: 2, deltaY: 0 })
      fireEvent.wheel(carousel, { deltaX: 60, deltaY: 0 })
      fireEvent.wheel(carousel, { deltaX: 160, deltaY: 0 })

      expect(carousel).toHaveAttribute('data-works-position', '6')
    } finally {
      vi.useRealTimers()
    }
  })

  it('restores the MTS centered state after a complete carousel loop', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
      act(() => vi.advanceTimersByTime(600))
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
      const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')
      const project = cards[WORKS_PROJECT_INDEX]

      expect(project).toHaveClass('is-centered')
      fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      expect(project).not.toHaveClass('is-centered')
      expect(cards[WORKS_PROJECT_INDEX + 1]).toHaveClass('is-centered')

      for (let step = 0; step < WORKS_CARD_COUNT - 1; step += 1) {
        act(() => vi.advanceTimersByTime(120))
        fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
      }

      expect(carousel).toHaveAttribute('data-works-position', String(WORKS_PROJECT_INDEX))
      expect(project).toHaveClass('is-centered')
      expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
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

      fireEvent.wheel(carousel, { deltaX: 0, deltaY: 120 })
      expect(carousel).toHaveAttribute('data-works-position', '4.6')
      expect(carousel).toHaveClass('is-wheeling')
      act(() => vi.advanceTimersByTime(120))
      expect(carousel).toHaveAttribute('data-works-position', '5')
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

  it('opens the AliExpress vertical presentation from its project card', () => {
    const onOpen = vi.fn()
    renderReadyWorksCarousel(onOpen)

    fireEvent.click(screen.getByRole('button', { name: 'Открыть презентацию «Collections Prototype - AliExpress DAU Hackathon»' }))
    expect(onOpen).toHaveBeenCalledWith('aliexpress')
  })

  it('opens the QR payment presentation from its project card', () => {
    const onOpen = vi.fn()
    vi.useFakeTimers()
    try {
      render(<WorksCardCarousel onOpen={onOpen} language="ru" />)
      const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

      act(() => vi.advanceTimersByTime(WORKS_ENTRY_DURATION_MS))
      for (let step = 0; step < 6; step += 1) {
        fireEvent.wheel(carousel, { deltaX: 220, deltaY: 0 })
        act(() => vi.advanceTimersByTime(WORKS_WHEEL_SETTLE_DELAY_MS))
      }

      fireEvent.click(screen.getByRole('button', { name: 'Открыть презентацию «Оплата по QR»' }))
      expect(onOpen).toHaveBeenCalledWith('sbp')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not capture a desktop pointer before it becomes a drag', () => {
    renderReadyWorksCarousel()
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const project = screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })
    const setPointerCapture = vi.fn()
    Object.defineProperty(carousel, 'setPointerCapture', { configurable: true, value: setPointerCapture })

    fireEvent.pointerDown(project, { pointerId: 7, clientX: 300 })
    expect(setPointerCapture).not.toHaveBeenCalled()

    fireEvent.pointerMove(carousel, { pointerId: 7, clientX: 292 })
    expect(setPointerCapture).toHaveBeenCalledWith(7)
  })
})
