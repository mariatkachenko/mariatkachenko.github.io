import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import PresentationModal, { type PresentationKind } from './PresentationModal'
import WorksCardCarousel, { handVariantForWorksPosition, worksPatternOffset, WORKS_INITIAL_POSITION, WORKS_PROJECT_INDEX } from './WorksCardCarousel'
import HomeBackButton from './HomeBackButton'
import MtsFlyoutOverlay from './MtsFlyoutOverlay'
import { type Language } from './i18n'
import { ROUTE_TRANSITION_READY_EVENT } from '../router'

export default function WorksPage({ language }: { language: Language }) {
  const [sceneReady, setSceneReady] = useState(() => !document.documentElement.dataset.transitionDirection)
  const [presentation, setPresentation] = useState<PresentationKind | null>(null)
  const [handVariant, setHandVariant] = useState(() => handVariantForWorksPosition(WORKS_INITIAL_POSITION))
  const [patternOffset, setPatternOffset] = useState(() => worksPatternOffset(WORKS_INITIAL_POSITION))
  const [flyoutActivation, setFlyoutActivation] = useState(1)
  const [flyoutVisible, setFlyoutVisible] = useState(false)
  const previousCenteredIndex = useRef<number | null>(WORKS_INITIAL_POSITION)
  const carouselEntryComplete = useRef(false)
  const closePresentation = useCallback(() => setPresentation(null), [])
  const updateScene = useCallback((position: number) => {
    setHandVariant(handVariantForWorksPosition(position))
    setPatternOffset(worksPatternOffset(position))
  }, [])
  const updateCenteredIndex = useCallback((nextIndex: number) => {
    if (nextIndex === WORKS_PROJECT_INDEX) {
      if (carouselEntryComplete.current) setFlyoutVisible(true)
      if (previousCenteredIndex.current !== WORKS_PROJECT_INDEX) {
        setFlyoutActivation((current) => current + 1)
      }
    } else {
      setFlyoutVisible(false)
    }
    previousCenteredIndex.current = nextIndex
  }, [])
  const finishCarouselEntry = useCallback(() => {
    carouselEntryComplete.current = true
    if (previousCenteredIndex.current === WORKS_PROJECT_INDEX) setFlyoutVisible(true)
  }, [])
  useEffect(() => {
    if (sceneReady) return
    const startScene = () => setSceneReady(true)
    document.addEventListener(ROUTE_TRANSITION_READY_EVENT, startScene, { once: true })
    if (!document.documentElement.dataset.transitionDirection) startScene()
    return () => document.removeEventListener(ROUTE_TRANSITION_READY_EVENT, startScene)
  }, [sceneReady])
  return <main
    className={`maria-subpage maria-works-page${sceneReady ? ' is-scene-ready' : ''}`}
    style={{
      '--works-pattern-desktop-x': `${patternOffset.desktopX}vw`,
      '--works-pattern-desktop-y': `${patternOffset.desktopY}vh`,
      '--works-pattern-mobile-x': `${patternOffset.mobileX}vw`,
      '--works-pattern-mobile-y': `${patternOffset.mobileY}vh`,
    } as CSSProperties}
  >
    <HomeBackButton language={language} />
    <div className={`maria-works-hand${handVariant === 'alternate' ? ' is-alternate' : ''}`} aria-hidden="true">
      <img className="maria-works-hand__image maria-works-hand__image--primary" src="/assets/maria/works-phone-hand.webp" alt="" aria-hidden="true" />
      <img className="maria-works-hand__image maria-works-hand__image--alternate" src="/assets/maria/works-phone-hand-lock.webp" alt="" aria-hidden="true" />
    </div>
    <WorksCardCarousel
      onOpen={setPresentation}
      onPositionChange={updateScene}
      onCenteredIndexChange={updateCenteredIndex}
      entryReady={sceneReady}
      onEntryComplete={finishCarouselEntry}
      language={language}
    />
    <MtsFlyoutOverlay activation={flyoutActivation} visible={sceneReady && flyoutVisible} />
    <PresentationModal project={presentation} onClose={closePresentation} language={language} />
  </main>
}
