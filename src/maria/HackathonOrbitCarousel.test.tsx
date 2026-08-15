import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HackathonOrbitCarousel, {
  HACKATHON_AUTOPLAY_MS,
  HACKATHON_AUTOPLAY_RESUME_MS,
  HACKATHON_ORBIT_COUNT,
  continuousOrbitOffset,
  horizontalWheelDelta,
  interpolatedOrbitPose,
  orbitPositionAfterDelta,
} from './HackathonOrbitCarousel'

describe('continuous hackathon orbit geometry', () => {
  it('wraps fractional positions around the orbit', () => {
    expect(continuousOrbitOffset(0, 1.5, 7)).toBe(-1.5)
    expect(continuousOrbitOffset(6, 0.5, 7)).toBe(-1.5)
    expect(orbitPositionAfterDelta(0, -360, 180, 7)).toBe(2)
    expect(orbitPositionAfterDelta(0, 270, 180, 7)).toBe(5.5)
  })

  it('interpolates pose between adjacent card stops', () => {
    const pose = interpolatedOrbitPose(0.5)
    expect(pose.scale).toBeCloseTo(0.93)
    expect(pose.opacity).toBeCloseTo(0.91)
    expect(pose.rotateY).toBe(9)
    expect(pose.rotateZ).toBe(4)
  })

  it('uses horizontal wheel and shift-wheel, but ignores plain vertical scrolling', () => {
    expect(horizontalWheelDelta(80, 120, false)).toBe(80)
    expect(horizontalWheelDelta(0, 120, true)).toBe(120)
    expect(horizontalWheelDelta(0, 120, false)).toBe(0)
  })
})

describe('HackathonOrbitCarousel', () => {
  afterEach(() => vi.useRealTimers())

  it('autoplays, pauses during drag, and resumes after a delay', () => {
    vi.useFakeTimers()
    render(<HackathonOrbitCarousel language="ru" />)
    const carousel = screen.getByRole('region', { name: /карусель/i })
    expect(HACKATHON_AUTOPLAY_MS).toBe(3200)
    expect(HACKATHON_AUTOPLAY_RESUME_MS).toBe(1800)

    act(() => vi.advanceTimersByTime(3200))
    expect(carousel).toHaveAttribute('data-orbit-position', '1')
    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 300 })
    act(() => vi.advanceTimersByTime(6400))
    expect(carousel).toHaveAttribute('data-orbit-position', '1')
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 300 })
    act(() => vi.advanceTimersByTime(1800))
    act(() => vi.advanceTimersByTime(3200))
    expect(carousel).toHaveAttribute('data-orbit-position', '2')
  })

  it('fills a twelve-position orbit with five non-interactive placeholders', () => {
    const { container } = render(<HackathonOrbitCarousel language="ru" />)
    expect(HACKATHON_ORBIT_COUNT).toBe(12)
    expect(screen.getAllByRole('button')).toHaveLength(7)
    expect(container.querySelectorAll('.maria-orbit-card')).toHaveLength(12)
    const placeholders = container.querySelectorAll('.maria-orbit-card--placeholder')
    expect(placeholders).toHaveLength(5)
    placeholders.forEach((placeholder) => {
      expect(placeholder).toHaveAttribute('aria-hidden', 'true')
      expect(placeholder.querySelector('button')).toBeNull()
    })
  })

  it('moves continuously by drag distance and horizontal wheel', () => {
    render(<HackathonOrbitCarousel language="ru" />)
    const carousel = screen.getByRole('region', { name: /карусель/i })
    const cards = screen.getAllByRole('button')

    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 400 })
    expect(fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 130 })).toBe(false)
    expect(carousel).toHaveAttribute('data-orbit-position', '1.5')
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 40 })
    expect(cards[2]).toHaveAttribute('aria-pressed', 'true')

    fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
    expect(carousel).toHaveAttribute('data-orbit-position', '3')
  })

  it('blocks a window-targeted navigation gesture when its coordinates are inside the carousel', () => {
    const { container } = render(<HackathonOrbitCarousel language="ru" />)
    const carousel = screen.getByRole('region', { name: /карусель/i })
    const gestureZone = container.querySelector<HTMLElement>('.maria-orbit-carousel__gesture-zone')!
    expect(gestureZone).toBeInTheDocument()
    vi.spyOn(gestureZone, 'getBoundingClientRect').mockReturnValue({
      left: 80, right: 920, top: 280, bottom: 680, width: 840, height: 400,
      x: 80, y: 280, toJSON: () => ({}),
    })

    const inside = new WheelEvent('wheel', {
      deltaX: 120, clientX: 500, clientY: 320, bubbles: true, cancelable: true,
    })
    window.dispatchEvent(inside)
    expect(inside.defaultPrevented).toBe(true)

    const outside = new WheelEvent('wheel', {
      deltaX: 120, clientX: 500, clientY: 120, bubbles: true, cancelable: true,
    })
    window.dispatchEvent(outside)
    expect(outside.defaultPrevented).toBe(false)
  })

  it('uses a tighter orbit amplitude than the previous layout', () => {
    render(<HackathonOrbitCarousel language="ru" />)
    const cards = screen.getAllByRole('button')
    expect(Math.abs(Number.parseFloat(cards[1].style.getPropertyValue('--orbit-x')))).toBeLessThan(28)
    expect(cards[1]).toHaveStyle({ '--orbit-y': '-8.6vh' })
    expect(cards[1].style.getPropertyValue('--orbit-x-mobile')).not.toBe('')
    expect(cards[1].style.getPropertyValue('--orbit-y-mobile')).not.toBe('')
  })
})
