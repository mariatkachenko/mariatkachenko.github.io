import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import ConceptProject from './ConceptProject'
import AliExpressProjectCard from './AliExpressProjectCard'
import MtsGameProjectCard from './MtsGameProjectCard'
import RaribleProjectCard from './RaribleProjectCard'
import TinnotechProjectCard from './TinnotechProjectCard'
import WalletProjectCard from './WalletProjectCard'
import AutopayProjectCard from './AutopayProjectCard'
import SbpProjectCard from './SbpProjectCard'
import ConnectionProjectCard from './ConnectionProjectCard'
import WorksProjectCard from './WorksProjectCard'
import type { Language } from './i18n'
import type { PresentationKind } from './PresentationModal'
import useCarouselNavigationGuard from './useCarouselNavigationGuard'

export const WORKS_CARD_COUNT = 9
export const WORKS_PROJECT_INDEX = 1
export const WORKS_AUTOPAY_INDEX = 2
export const WORKS_CONNECTION_INDEX = 3
export const WORKS_TINNOTECH_INDEX = 4
export const WORKS_ALIEXPRESS_INDEX = 5
export const WORKS_RARIBLE_INDEX = 6
export const WORKS_WALLET_INDEX = 7
export const WORKS_MTS_PLACEHOLDER_INDEX = 8
export const WORKS_SBP_INDEX = 0
export const WORKS_DRAG_STEP_PX = 150
export const WORKS_MOBILE_DRAG_STEP_PX = 140
export const WORKS_WHEEL_STEP_PX = 220
export const WORKS_MOBILE_WHEEL_STEP_PX = 200
export const WORKS_INITIAL_POSITION = WORKS_PROJECT_INDEX
export const WORKS_ENTRY_DURATION_MS = 600
export const WORKS_AUTOPLAY_MS = 4800
export const WORKS_WHEEL_SETTLE_DELAY_MS = 120
export const WORKS_DESKTOP_CARD_GAP_VW = 8.25
export const WORKS_DESKTOP_OUTER_GAP_VW = 2.25
export const WORKS_PLACEHOLDER_COVERS = [
  '/assets/maria/works-placeholder-payments-a.webp',
] as const

const WORKS_PLACEHOLDER_COVER_POSITIONS = ['center', 'center'] as const

export type WorksRowPose = {
  rotateY: number
  x: number
  layer: number
}

export function normalizeWorksPosition(position: number, count = WORKS_CARD_COUNT) {
  return ((position % count) + count) % count
}

export function worksPatternOffset(position: number, count = WORKS_CARD_COUNT) {
  const angle = normalizeWorksPosition(position, count) / count * Math.PI * 2
  const rounded = (value: number) => Number(value.toFixed(3))
  return {
    desktopX: rounded(Math.sin(angle) * 2.4),
    desktopY: rounded(Math.cos(angle) * 0.8),
    mobileX: rounded(Math.sin(angle) * 0.8),
    mobileY: rounded(Math.cos(angle) * 1.8),
  }
}

export function continuousWorksOffset(index: number, position: number, count = WORKS_CARD_COUNT) {
  let offset = index - position
  const half = count / 2
  while (offset > half) offset -= count
  while (offset < -half) offset += count
  return offset
}

export function worksPositionAfterDelta(
  position: number,
  deltaPx: number,
  stepPx = WORKS_DRAG_STEP_PX,
  count = WORKS_CARD_COUNT,
) {
  return normalizeWorksPosition(position - deltaPx / stepPx, count)
}

export function worksDragReleasePosition(position: number, count = WORKS_CARD_COUNT, snap = false) {
  return normalizeWorksPosition(snap ? Math.round(position) : position, count)
}

export function worksDragStep(isMobile: boolean) {
  return isMobile ? WORKS_MOBILE_DRAG_STEP_PX : WORKS_DRAG_STEP_PX
}

export function worksWheelStep(isMobile: boolean) {
  return isMobile ? WORKS_MOBILE_WHEEL_STEP_PX : WORKS_WHEEL_STEP_PX
}

export function handVariantForWorksPosition(position: number): 'primary' | 'alternate' {
  const centeredIndex = normalizeWorksPosition(Math.round(position))
  return Math.floor(centeredIndex / 3) % 2 === 0 ? 'primary' : 'alternate'
}

export function worksRowPose(offset: number): WorksRowPose {
  const magnitude = Math.min(80, Math.abs(offset) * 36)
  return {
    rotateY: offset === 0 ? 0 : -Math.sign(offset) * magnitude,
    x: offset,
    layer: Math.max(1, 14 - Math.round(Math.abs(offset))),
  }
}

export function worksDesktopRowX(offset: number) {
  const outerDistance = Math.max(0, Math.abs(offset) - 1)
  return Number((
    offset * WORKS_DESKTOP_CARD_GAP_VW
    + Math.sign(offset) * outerDistance * WORKS_DESKTOP_OUTER_GAP_VW
  ).toFixed(3))
}

export function worksCardFocus(offset: number) {
  const distance = Math.min(2, Math.abs(offset))
  const rounded = (value: number) => Number(value.toFixed(3))
  return {
    lightBrightness: rounded(1 - distance * 0.08),
    lightSaturation: rounded(1 - distance * 0.03),
    darkSaturation: rounded(1 - distance * 0.04),
    darkHue: rounded(-distance * 3),
    darkGlow: rounded(0.18 * (1 - distance / 2)),
  }
}

export function worksCardGradient(offset: number) {
  const distance = Math.min(2, Math.abs(offset))
  const mobileLowerDepth = distance <= 1
    ? distance * 0.008
    : 0.008 - (distance - 1) * 0.006
  return {
    strength: Number((distance * 0.07).toFixed(3)),
    desktopAngle: offset > 0 ? 270 : 90,
    mobileAngle: offset > 0 ? 0 : 180,
    mobileLowerDepth: offset > 0 ? Number(mobileLowerDepth.toFixed(3)) : 0,
  }
}

export function visibleWorksCardIndices(position: number, count = WORKS_CARD_COUNT) {
  const center = Math.round(position)
  return new Set(Array.from(
    { length: Math.min(5, count) },
    (_, slot) => Math.round(normalizeWorksPosition(center + slot - 2, count)),
  ))
}

export function shouldLoadDeferredWorksArtwork(offset: number) {
  return Math.abs(offset) <= 1
}

export function shouldLoadVisibleWorksArtwork(offset: number) {
  return Math.abs(offset) <= 2
}

export type MobileWorksLoopPose = {
  y: number
  scale: number
  opacity: number
  layer: number
}

export type MobileWorksDeckPose = {
  y: number
  scale: number
  layer: number
}

export function mobileWorksDeckPose(offset: number): MobileWorksDeckPose {
  const distance = Math.min(2, Math.abs(offset))
  const rounded = (value: number) => Number(value.toFixed(3))
  return {
    y: rounded(offset * 5.417),
    scale: rounded(1 - distance * 0.06),
    layer: 20 - Math.round(distance * 4),
  }
}

export function mobileWorksLoopPose(offset: number, count = WORKS_CARD_COUNT): MobileWorksLoopPose {
  const angle = offset / count * Math.PI * 2
  const frontness = (Math.cos(angle) + 1) / 2
  const y = Math.sin(angle) * 22
  return {
    y: Math.abs(y) < 1e-10 ? 0 : y,
    scale: 1,
    opacity: 0.18 + frontness * 0.82,
    layer: 1 + Math.round(frontness * 19),
  }
}

export function worksPointerCoordinate(
  event: { clientX: number; clientY: number },
  isMobile: boolean,
) {
  return isMobile ? event.clientY : event.clientX
}

export function worksWheelDelta(deltaX: number, deltaY: number, shiftKey: boolean, isMobile: boolean) {
  if (isMobile) return deltaY
  if (deltaX !== 0) return deltaX
  return shiftKey ? deltaY : 0
}

type WorksCardCarouselProps = {
  onOpen: (project: PresentationKind) => void
  onPositionChange?: (position: number) => void
  onCenteredIndexChange?: (index: number) => void
  entryReady?: boolean
  onEntryComplete?: () => void
  paused?: boolean
  language: Language
}

export default function WorksCardCarousel({ onOpen, onPositionChange, onCenteredIndexChange, entryReady = true, onEntryComplete, paused = false, language }: WorksCardCarouselProps) {
  const [position, setPosition] = useState(WORKS_INITIAL_POSITION)
  const [dragging, setDragging] = useState(false)
  const [wheeling, setWheeling] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const [interactionVersion, setInteractionVersion] = useState(0)
  const pointerOrigin = useRef<{
    coordinate: number
    position: number
    isMobile: boolean
    pointerId: number
    captured: boolean
  } | null>(null)
  const suppressClick = useRef(false)
  const wheelSettleTimer = useRef<number | null>(null)
  const wheelGesture = useRef<{
    position: number
    delta: number
    capped: boolean
    tailSeen: boolean
  } | null>(null)
  const carouselElement = useRef<HTMLElement | null>(null)
  useCarouselNavigationGuard(carouselElement)
  const visibleCardIndices = visibleWorksCardIndices(position)
  const centeredCardIndex = normalizeWorksPosition(Math.round(position))
  const centeredCardIsOpenable = centeredCardIndex === WORKS_PROJECT_INDEX
    || centeredCardIndex === WORKS_RARIBLE_INDEX
    || centeredCardIndex === WORKS_ALIEXPRESS_INDEX
    || centeredCardIndex === WORKS_MTS_PLACEHOLDER_INDEX
    || centeredCardIndex === WORKS_SBP_INDEX
    || centeredCardIndex === WORKS_AUTOPAY_INDEX
    || centeredCardIndex === WORKS_CONNECTION_INDEX

  useEffect(() => {
    if (!entryReady) return
    const timer = window.setTimeout(() => {
      setIsEntering(false)
      onEntryComplete?.()
    }, WORKS_ENTRY_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [entryReady, onEntryComplete])

  useEffect(() => () => {
    if (wheelSettleTimer.current !== null) window.clearTimeout(wheelSettleTimer.current)
  }, [])

  useEffect(() => {
    if (!paused) return
    if (wheelSettleTimer.current !== null) window.clearTimeout(wheelSettleTimer.current)
    wheelSettleTimer.current = null
    wheelGesture.current = null
    pointerOrigin.current = null
    setWheeling(false)
    setDragging(false)
  }, [paused])

  useEffect(() => {
    onPositionChange?.(position)
  }, [onPositionChange, position])

  useEffect(() => {
    onCenteredIndexChange?.(centeredCardIndex)
  }, [centeredCardIndex, onCenteredIndexChange])

  useEffect(() => {
    if (isEntering || dragging || paused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setPosition((current) => normalizeWorksPosition(Math.round(current) + 1))
    }, WORKS_AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [dragging, interactionVersion, isEntering, paused])

  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (isEntering || paused) return
    if (wheelSettleTimer.current !== null) window.clearTimeout(wheelSettleTimer.current)
    wheelGesture.current = null
    setWheeling(false)
    setInteractionVersion((current) => current + 1)
    const isMobile = window.matchMedia?.('(max-width: 600px)').matches ?? false
    pointerOrigin.current = {
      coordinate: worksPointerCoordinate(event, isMobile),
      position,
      isMobile,
      pointerId: event.pointerId,
      captured: false,
    }
    suppressClick.current = false
    setDragging(true)
  }

  const currentDragStep = () => worksDragStep(
    window.matchMedia?.('(max-width: 600px)').matches ?? false,
  )

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointerOrigin.current) return
    event.preventDefault()
    const delta = worksPointerCoordinate(event, pointerOrigin.current.isMobile) - pointerOrigin.current.coordinate
    if (Math.abs(delta) >= 6 && !pointerOrigin.current.captured) {
      event.currentTarget.setPointerCapture?.(pointerOrigin.current.pointerId)
      pointerOrigin.current.captured = true
    }
    setPosition(worksPositionAfterDelta(pointerOrigin.current.position, delta, currentDragStep()))
  }

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointerOrigin.current) return
    const delta = worksPointerCoordinate(event, pointerOrigin.current.isMobile) - pointerOrigin.current.coordinate
    suppressClick.current = Math.abs(delta) >= 6
    const finalPosition = worksPositionAfterDelta(pointerOrigin.current.position, delta, currentDragStep())
    setPosition(worksDragReleasePosition(
      finalPosition,
      WORKS_CARD_COUNT,
      true,
    ))
    const captured = pointerOrigin.current.captured
    pointerOrigin.current = null
    setDragging(false)
    if (captured) event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const cancelDrag = () => {
    pointerOrigin.current = null
    suppressClick.current = false
    setDragging(false)
  }

  const handleWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (isEntering || paused) return
    const isMobile = window.matchMedia?.('(max-width: 600px)').matches ?? false
    const delta = worksWheelDelta(event.deltaX, event.deltaY, event.shiftKey, isMobile)
    if (delta === 0) return
    event.preventDefault()
    setWheeling(true)
    setInteractionVersion((current) => current + 1)
    const step = worksWheelStep(isMobile)
    if (!wheelGesture.current) {
      wheelGesture.current = { position: Math.round(position), delta: 0, capped: false, tailSeen: false }
    } else if (wheelGesture.current.capped) {
      const magnitude = Math.abs(delta)
      const reversesDirection = Math.sign(delta) !== Math.sign(wheelGesture.current.delta)
      if (magnitude <= 6) {
        wheelGesture.current.tailSeen = true
      } else if ((wheelGesture.current.tailSeen || reversesDirection) && magnitude >= 24) {
        wheelGesture.current = { position: Math.round(position), delta: 0, capped: false, tailSeen: false }
      }
    }
    wheelGesture.current.delta += delta
    const gestureOffset = Math.max(-1, Math.min(1, wheelGesture.current.delta / step))
    wheelGesture.current.capped = Math.abs(gestureOffset) === 1
    setPosition(normalizeWorksPosition(wheelGesture.current.position + gestureOffset))
    if (wheelSettleTimer.current !== null) window.clearTimeout(wheelSettleTimer.current)
    wheelSettleTimer.current = window.setTimeout(() => {
      setPosition((current) => worksDragReleasePosition(current, WORKS_CARD_COUNT, true))
      setWheeling(false)
      wheelGesture.current = null
      wheelSettleTimer.current = null
    }, WORKS_WHEEL_SETTLE_DELAY_MS)
  }

  return <section
    ref={carouselElement}
    className={`maria-works-carousel${centeredCardIsOpenable ? ' has-clickable-center' : ''}${dragging ? ' is-dragging' : ''}${wheeling ? ' is-wheeling' : ''}${isEntering ? ' is-entering' : ''}${isEntering && entryReady ? ' is-entry-active' : ''}`}
    aria-label={language === 'ru' ? 'Карусель рабочих проектов' : 'Work project carousel'}
    data-works-position={Number(position.toFixed(3))}
    onPointerDown={beginDrag}
    onPointerMove={moveDrag}
    onPointerUp={finishDrag}
    onPointerCancel={cancelDrag}
    onWheel={handleWheel}
    onDragStart={(event) => event.preventDefault()}
    onClickCapture={(event) => {
      if (!suppressClick.current) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
    }}
  >
    {Array.from({ length: WORKS_CARD_COUNT }, (_, index) => {
      const offset = continuousWorksOffset(index, position)
      const pose = worksRowPose(offset)
      const focus = worksCardFocus(offset)
      const gradient = worksCardGradient(offset)
      const mobileLoopPose = mobileWorksLoopPose(offset)
      const mobileDeckPose = mobileWorksDeckPose(offset)
      const compact = (value: number) => Number(value.toFixed(3))
      const entryDistance = Math.abs(offset)
      const entryLift = entryDistance >= 1.5 ? -3 : entryDistance >= 0.5 ? -1 : 0
      const projectCard = index === WORKS_PROJECT_INDEX
      const mtsGameCard = index === WORKS_MTS_PLACEHOLDER_INDEX
      const raribleCard = index === WORKS_RARIBLE_INDEX
      const aliexpressCard = index === WORKS_ALIEXPRESS_INDEX
      const tinnotechCard = index === WORKS_TINNOTECH_INDEX
      const walletCard = index === WORKS_WALLET_INDEX
      const autopayCard = index === WORKS_AUTOPAY_INDEX
      const sbpCard = index === WORKS_SBP_INDEX
      const connectionCard = index === WORKS_CONNECTION_INDEX
      const centered = index === centeredCardIndex
      const visible = visibleCardIndices.has(index)
      const genericCardIndex = index
        - (index > WORKS_PROJECT_INDEX ? 1 : 0)
        - (index > WORKS_MTS_PLACEHOLDER_INDEX ? 1 : 0)
      const coverIndex = genericCardIndex % WORKS_PLACEHOLDER_COVERS.length
      return <article
        className={`maria-works-deck-card${projectCard ? ' has-project' : ' is-empty'}${index === WORKS_MTS_PLACEHOLDER_INDEX ? ' has-mts-game' : ''}${raribleCard ? ' has-rarible' : ''}${aliexpressCard ? ' has-aliexpress' : ''}${tinnotechCard ? ' has-tinnotech' : ''}${walletCard ? ' has-wallet' : ''}${autopayCard ? ' has-autopay' : ''}${sbpCard ? ' has-sbp' : ''}${connectionCard ? ' has-connection' : ''}${centered ? ' is-centered' : ''}${visible ? '' : ' is-hidden'}`}
        aria-hidden={!visible}
        data-index={index}
        data-offset={Number(offset.toFixed(3))}
        data-layer={pose.layer}
        key={index}
        style={{
          '--works-row-scale': 1.1,
          '--works-row-x': `${worksDesktopRowX(pose.x)}vw`,
          '--works-row-rotate-y': `${pose.rotateY}deg`,
          '--works-entry-x': `${compact(offset * 1.4)}vw`,
          '--works-entry-lift-y': `${entryLift}vh`,
          '--works-entry-rotate-y': `${offset === 0 ? 0 : -Math.sign(offset) * 10}deg`,
          '--works-entry-y-mobile': `${compact(Math.sign(offset) * Math.min(2, Math.abs(offset)) * 1.6)}dvh`,
          '--works-row-rotate-x-mobile': `${-pose.rotateY}deg`,
          '--works-loop-y-mobile': `${compact(mobileLoopPose.y)}dvh`,
          '--works-loop-scale-mobile': compact(mobileLoopPose.scale),
          '--works-loop-opacity-mobile': compact(mobileLoopPose.opacity),
          '--works-loop-layer-mobile': mobileLoopPose.layer,
          '--works-deck-y-mobile': `${mobileDeckPose.y}dvh`,
          '--works-deck-scale-mobile': mobileDeckPose.scale,
          '--works-deck-layer-mobile': mobileDeckPose.layer,
          '--works-row-layer': pose.layer,
          '--works-entry-index': Math.min(2, Math.abs(offset)),
          '--works-card-brightness-light': focus.lightBrightness,
          '--works-card-saturation-light': focus.lightSaturation,
          '--works-card-saturation-dark': focus.darkSaturation,
          '--works-card-dark-hue': `${focus.darkHue}deg`,
          '--works-card-dark-glow': focus.darkGlow,
          '--works-card-shade-strength': gradient.strength,
          '--works-card-shade-desktop-angle': `${gradient.desktopAngle}deg`,
          '--works-card-shade-mobile-angle': `${gradient.mobileAngle}deg`,
          '--works-card-mobile-lower-depth': gradient.mobileLowerDepth,
        } as CSSProperties}
      >
        {projectCard
          ? <ConceptProject
            onOpen={() => onOpen('mts')}
            language={language}
            loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
          />
          : raribleCard
            ? <RaribleProjectCard
              onOpen={() => onOpen('rarible')}
              ariaLabel={language === 'ru'
                ? 'Открыть презентацию «Rarible Charity Program»'
                : 'Open presentation “Rarible Charity Program”'}
              language={language}
              loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
            />
            : aliexpressCard
              ? <AliExpressProjectCard
                onOpen={() => onOpen('aliexpress')}
                ariaLabel={language === 'ru'
                  ? 'Открыть презентацию «Collections Prototype - AliExpress DAU Hackathon»'
                  : 'Open presentation “Collections Prototype - AliExpress DAU Hackathon”'}
                language={language}
                loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
              />
            : mtsGameCard
              ? <MtsGameProjectCard
                onOpen={() => onOpen('mts-game')}
                ariaLabel={language === 'ru'
                  ? 'Открыть презентацию «Страницы игр на сайте МТС Оплата»'
                  : 'Open presentation “Game pages on the MTS Payment website”'}
                language={language}
                loadArtwork={shouldLoadDeferredWorksArtwork(offset)}
              />
            : sbpCard
              ? <SbpProjectCard
                onOpen={() => onOpen('sbp')}
                ariaLabel={language === 'ru'
                  ? 'Открыть презентацию «Оплата по QR»'
                  : 'Open presentation “QR Payment”'}
                language={language}
                loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
              />
            : autopayCard
              ? <AutopayProjectCard
                onOpen={() => onOpen('autopay')}
                ariaLabel={language === 'ru'
                  ? 'Открыть презентацию «Автоплатежи МТС»'
                  : 'Open presentation “MTS Autopay”'}
                language={language}
                loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
              />
            : connectionCard
              ? <ConnectionProjectCard
                onOpen={() => onOpen('connection')}
                ariaLabel={language === 'ru'
                  ? 'Открыть презентацию «Пополнение баланса»'
                  : 'Open presentation “Balance top-up”'}
                language={language}
                loadArtwork={shouldLoadVisibleWorksArtwork(offset)}
              />
            : <div className="maria-works-deck-card__empty" aria-hidden="true">
            {tinnotechCard
                ? <TinnotechProjectCard language={language} loadArtwork={shouldLoadVisibleWorksArtwork(offset)} />
              : walletCard
                ? <WalletProjectCard language={language} loadArtwork={shouldLoadVisibleWorksArtwork(offset)} />
              : <WorksProjectCard
                title={language === 'ru' ? 'Новый проект' : 'New project'}
                meta={language === 'ru' ? 'Скоро' : 'Coming soon'}
                imageSrc={WORKS_PLACEHOLDER_COVERS[coverIndex]}
                imagePosition={WORKS_PLACEHOLDER_COVER_POSITIONS[coverIndex]}
                placeholder
              />}
          </div>}
      </article>
    })}
  </section>
}
