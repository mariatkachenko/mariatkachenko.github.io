import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { copyFor, type Language } from './i18n'
import useCarouselNavigationGuard from './useCarouselNavigationGuard'

const PROJECT_COUNT = 7
export const HACKATHON_ORBIT_COUNT = 12
const SWIPE_THRESHOLD_PX = 42
export const HACKATHON_DRAG_STEP_DESKTOP = 180
export const HACKATHON_DRAG_STEP_MOBILE = 130
export const HACKATHON_AUTOPLAY_MS = 3200
export const HACKATHON_AUTOPLAY_RESUME_MS = 1800

export type OrbitCardSize = 'large' | 'medium' | 'compact'

const CARD_SIZE_SCALE: Record<OrbitCardSize, number> = {
  large: 1.14,
  medium: 1,
  compact: 0.88,
}

const projectTitles = [
  { ru: 'Raible Charity Program — Phystech Business Solutions', en: 'Raible Charity Program — Phystech Business Solutions', symbol: '◇', size: 'large' },
  { ru: 'Weather Wizard Mobile App — Career Factory Contest', en: 'Weather Wizard Mobile App — Career Factory Contest', symbol: '△', size: 'compact' },
  { ru: 'Collections Prototype — AliExpress DAU Hackathon', en: 'Collections Prototype — AliExpress DAU Hackathon', symbol: '◎', size: 'medium' },
  { ru: 'Web AR Platform — Indoor Navigation', en: 'Web AR Platform — Indoor Navigation', symbol: '⌖', size: 'large' },
  { ru: 'Редизайн карточки Avito', en: 'Avito Card Redesign', symbol: '⌁', size: 'medium' },
  { ru: 'Новогодние подарки Tele2', en: 'Tele2 New Year Gifts', symbol: '✦', size: 'compact' },
  { ru: 'Deal Done To Do App', en: 'Deal Done To Do App', symbol: '□', size: 'large' },
] as const

export function cardSizeScale(size: OrbitCardSize) {
  return CARD_SIZE_SCALE[size]
}

export function composedOrbitScale(positionScale: number, sizeScale: number, active: boolean) {
  return positionScale * sizeScale * (active ? 1.12 : 1)
}

export function projectsFor(language: Language) {
  return projectTitles.map((project) => ({
    title: project[language],
    author: language === 'ru' ? 'Мария Ткаченко' : 'Maria Tkachenko',
    symbol: project.symbol,
    size: project.size,
  }))
}

export function orbitOffset(index: number, active: number, count: number) {
  let offset = index - active
  const half = Math.floor(count / 2)
  if (offset > half) offset -= count
  if (offset < -half) offset += count
  return offset
}

export type OrbitPose = {
  layer: 'front' | 'rear'
  scale: number
  opacity: number
  rotateY: number
  rotateZ: number
}

export function orbitPose(offset: number): OrbitPose {
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)
  const poses = [
    { scale: 1, opacity: 1, rotateY: 0, rotateZ: 0 },
    { scale: 0.86, opacity: 0.82, rotateY: 18, rotateZ: 8 },
    { scale: 0.68, opacity: 0.5, rotateY: 34, rotateZ: 14 },
    { scale: 0.5, opacity: 0.2, rotateY: 50, rotateZ: 20 },
  ] as const
  const pose = poses[Math.min(distance, poses.length - 1)]
  return {
    layer: distance === 3 ? 'rear' : 'front',
    scale: pose.scale,
    opacity: pose.opacity,
    rotateY: pose.rotateY * direction,
    rotateZ: pose.rotateZ * direction,
  }
}

export function normalizeOrbitPosition(position: number, count: number) {
  return ((position % count) + count) % count
}

export function continuousOrbitOffset(index: number, position: number, count: number) {
  let offset = index - position
  const half = count / 2
  while (offset > half) offset -= count
  while (offset < -half) offset += count
  return offset
}

export function interpolatedOrbitPose(offset: number): OrbitPose {
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)
  const low = Math.floor(distance)
  const high = Math.ceil(distance)
  const progress = distance - low
  const from = orbitPose(low)
  const to = orbitPose(high)
  const interpolate = (a: number, b: number) => a + (b - a) * progress
  return {
    layer: distance >= 2.5 ? 'rear' : 'front',
    scale: interpolate(from.scale, to.scale),
    opacity: interpolate(from.opacity, to.opacity),
    rotateY: interpolate(Math.abs(from.rotateY), Math.abs(to.rotateY)) * direction,
    rotateZ: interpolate(Math.abs(from.rotateZ), Math.abs(to.rotateZ)) * direction,
  }
}

export function orbitPositionAfterDelta(position: number, deltaPx: number, stepPx: number, count: number) {
  return normalizeOrbitPosition(position - deltaPx / stepPx, count)
}

export function horizontalWheelDelta(deltaX: number, deltaY: number, shiftKey: boolean) {
  if (deltaX !== 0) return deltaX
  return shiftKey ? deltaY : 0
}

export function activeIndexAfterSwipe(
  active: number,
  deltaX: number,
  count: number,
  threshold = SWIPE_THRESHOLD_PX,
) {
  if (Math.abs(deltaX) < threshold) return active
  const direction = deltaX < 0 ? 1 : -1
  return (active + direction + count) % count
}

export default function HackathonOrbitCarousel({ language }: { language: Language }) {
  const copy = copyFor(language)
  const projects = projectsFor(language)
  const [position, setPosition] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const pointerOrigin = useRef<{ x: number; position: number } | null>(null)
  const suppressClick = useRef(false)
  const navigationGuardZone = useRef<HTMLDivElement | null>(null)
  const wheelSnapTimer = useRef<number | null>(null)
  const autoplayResumeTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (wheelSnapTimer.current !== null) window.clearTimeout(wheelSnapTimer.current)
      if (autoplayResumeTimer.current !== null) window.clearTimeout(autoplayResumeTimer.current)
    }
  }, [])

  useCarouselNavigationGuard(navigationGuardZone)

  useEffect(() => {
    if (autoplayPaused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setPosition((current) => normalizeOrbitPosition(Math.round(current) + 1, HACKATHON_ORBIT_COUNT))
    }, HACKATHON_AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [autoplayPaused])

  const pauseAutoplay = () => {
    if (autoplayResumeTimer.current !== null) {
      window.clearTimeout(autoplayResumeTimer.current)
      autoplayResumeTimer.current = null
    }
    setAutoplayPaused(true)
  }

  const resumeAutoplayLater = () => {
    if (autoplayResumeTimer.current !== null) window.clearTimeout(autoplayResumeTimer.current)
    autoplayResumeTimer.current = window.setTimeout(() => {
      setAutoplayPaused(false)
      autoplayResumeTimer.current = null
    }, HACKATHON_AUTOPLAY_RESUME_MS)
  }

  const dragStep = () => window.matchMedia?.('(max-width: 600px)').matches
    ? HACKATHON_DRAG_STEP_MOBILE
    : HACKATHON_DRAG_STEP_DESKTOP

  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    pauseAutoplay()
    pointerOrigin.current = { x: event.clientX, position }
    suppressClick.current = false
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointerOrigin.current) return
    event.preventDefault()
    const deltaX = event.clientX - pointerOrigin.current.x
    setPosition(orbitPositionAfterDelta(pointerOrigin.current.position, deltaX, dragStep(), HACKATHON_ORBIT_COUNT))
  }

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointerOrigin.current) return
    const deltaX = event.clientX - pointerOrigin.current.x
    suppressClick.current = Math.abs(deltaX) >= 6
    const finalPosition = orbitPositionAfterDelta(pointerOrigin.current.position, deltaX, dragStep(), HACKATHON_ORBIT_COUNT)
    setPosition(normalizeOrbitPosition(Math.round(finalPosition), HACKATHON_ORBIT_COUNT))
    pointerOrigin.current = null
    setDragging(false)
    resumeAutoplayLater()
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const cancelDrag = () => {
    pointerOrigin.current = null
    suppressClick.current = false
    setDragging(false)
    resumeAutoplayLater()
  }

  const handleWheel = (event: ReactWheelEvent<HTMLElement>) => {
    const delta = horizontalWheelDelta(event.deltaX, event.deltaY, event.shiftKey)
    if (delta === 0) return
    event.preventDefault()
    pauseAutoplay()
    setPosition((current) => orbitPositionAfterDelta(current, -delta, HACKATHON_DRAG_STEP_DESKTOP, HACKATHON_ORBIT_COUNT))
    if (wheelSnapTimer.current !== null) window.clearTimeout(wheelSnapTimer.current)
    wheelSnapTimer.current = window.setTimeout(() => {
      setPosition((current) => normalizeOrbitPosition(Math.round(current), HACKATHON_ORBIT_COUNT))
      wheelSnapTimer.current = null
      resumeAutoplayLater()
    }, 140)
  }

  return <section
    className={`maria-orbit-carousel${dragging ? ' is-dragging' : ''}`}
    aria-label={copy.hackathonCarousel}
    data-orbit-position={Number(position.toFixed(3))}
    onPointerDown={beginDrag}
    onPointerMove={moveDrag}
    onPointerUp={finishDrag}
    onPointerCancel={cancelDrag}
    onWheel={handleWheel}
    onClickCapture={(event) => {
      if (!suppressClick.current) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
    }}
  >
    <div ref={navigationGuardZone} className="maria-orbit-carousel__gesture-zone" aria-hidden="true" />
    {Array.from({ length: HACKATHON_ORBIT_COUNT }, (_, index) => {
      const offset = continuousOrbitOffset(index, position, HACKATHON_ORBIT_COUNT)
      const pose = interpolatedOrbitPose(offset)
      const project = projects[index]
      const number = String(index + 1).padStart(2, '0')
      const isActive = Boolean(project) && Math.abs(offset) < 0.001
      const sizeScale = project ? cardSizeScale(project.size) : 1
      const orbitX = Math.sin(offset * Math.PI / 4.2) * 27
      const orbitY = Math.abs(offset) < 0.001 ? 0 : -(3 + Math.abs(offset) * 5.6)
      const orbitXMobile = Math.sin(offset * Math.PI / 4.2) * 44
      const orbitYMobile = Math.abs(offset) < 0.001 ? 0 : -(6 + Math.abs(offset) * 9)
      const cardStyle = {
        '--orbit-position-scale': pose.scale,
        '--orbit-card-size-scale': sizeScale,
        '--orbit-active-scale': isActive ? 1.12 : 1,
        '--orbit-scale': composedOrbitScale(pose.scale, sizeScale, isActive),
        '--orbit-opacity': pose.opacity,
        '--orbit-rotate-y': `${pose.rotateY}deg`,
        '--orbit-rotate-z': `${pose.rotateZ}deg`,
        '--orbit-x': `${orbitX}vw`,
        '--orbit-y': `${orbitY}vh`,
        '--orbit-x-mobile': `${orbitXMobile}vw`,
        '--orbit-y-mobile': `${orbitYMobile}vh`,
      } as CSSProperties
      if (!project) {
        return <article
          className={`maria-orbit-card maria-orbit-card--placeholder maria-orbit-card--${pose.layer}`}
          aria-hidden="true"
          data-offset={Number(offset.toFixed(3))}
          data-orbit-layer={pose.layer}
          key={number}
          style={cardStyle}
        />
      }
      return <button
        className={`maria-orbit-card maria-orbit-card--${pose.layer}${isActive ? ' is-active' : ''}`}
        type="button"
        aria-label={`${copy.hackathonProject}: ${project.title}`}
        aria-pressed={isActive}
        data-offset={Number(offset.toFixed(3))}
        data-orbit-layer={pose.layer}
        data-card-size={project.size}
        key={number}
        onClick={() => setPosition(index)}
        style={cardStyle}
      >
        <span className="maria-orbit-card__settings" aria-hidden="true"><b>⚙</b><i>⌄</i></span>
        <span className="maria-orbit-card__line-art" aria-hidden="true">
          <i className="maria-orbit-card__symbol">{project.symbol}</i>
          <i className="maria-orbit-card__orbit" />
        </span>
        <span className="maria-orbit-card__meta">HACKATHON / PROJECT</span>
        <span className="maria-orbit-card__title">{project.title}</span>
        <span className="maria-orbit-card__author">{project.author}</span>
        <span className="maria-orbit-card__index">{number}</span>
      </button>
    })}
  </section>
}
