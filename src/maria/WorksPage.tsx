import { useCallback, useRef, useState, type CSSProperties } from 'react'
import PresentationModal, { type PresentationKind } from './PresentationModal'
import WorksCardCarousel, { handVariantForWorksPosition, worksPatternOffset, WORKS_INITIAL_POSITION, WORKS_PROJECT_INDEX } from './WorksCardCarousel'
import HomeBackButton from './HomeBackButton'
import MtsFlyoutOverlay from './MtsFlyoutOverlay'
import WorksPaintSplash, { shouldTriggerWorksPaintSplash } from './WorksPaintSplash'
import { type Language } from './i18n'

export default function WorksPage({ language }: { language: Language }) {
  const [presentation, setPresentation] = useState<PresentationKind | null>(null)
  const [handVariant, setHandVariant] = useState(() => handVariantForWorksPosition(WORKS_INITIAL_POSITION))
  const [patternOffset, setPatternOffset] = useState(() => worksPatternOffset(WORKS_INITIAL_POSITION))
  const [paintActivation, setPaintActivation] = useState(0)
  const [flyoutActivation, setFlyoutActivation] = useState(1)
  const [flyoutVisible, setFlyoutVisible] = useState(true)
  const previousCenteredIndex = useRef<number | null>(WORKS_INITIAL_POSITION)
  const closePresentation = useCallback(() => setPresentation(null), [])
  const updateScene = useCallback((position: number) => {
    setHandVariant(handVariantForWorksPosition(position))
    setPatternOffset(worksPatternOffset(position))
  }, [])
  const updateCenteredIndex = useCallback((nextIndex: number) => {
    if (nextIndex === WORKS_PROJECT_INDEX) {
      setFlyoutVisible(true)
      if (previousCenteredIndex.current !== WORKS_PROJECT_INDEX) {
        setFlyoutActivation((current) => current + 1)
      }
    } else {
      setFlyoutVisible(false)
    }
    if (shouldTriggerWorksPaintSplash(previousCenteredIndex.current, nextIndex)) {
      setPaintActivation((current) => current + 1)
    }
    previousCenteredIndex.current = nextIndex
  }, [])
  return <main
    className="maria-subpage maria-works-page"
    style={{
      '--works-pattern-desktop-x': `${patternOffset.desktopX}vw`,
      '--works-pattern-desktop-y': `${patternOffset.desktopY}vh`,
      '--works-pattern-mobile-x': `${patternOffset.mobileX}vw`,
      '--works-pattern-mobile-y': `${patternOffset.mobileY}vh`,
    } as CSSProperties}
  >
    <HomeBackButton language={language} />
    <div className={`maria-works-hand${handVariant === 'alternate' ? ' is-alternate' : ''}`} aria-hidden="true">
      <img className="maria-works-hand__image maria-works-hand__image--primary" src="/assets/maria/works-phone-hand.png" alt="" aria-hidden="true" />
      <img className="maria-works-hand__image maria-works-hand__image--alternate" src="/assets/maria/works-phone-hand-lock.png" alt="" aria-hidden="true" />
    </div>
    <WorksCardCarousel
      onOpen={setPresentation}
      onPositionChange={updateScene}
      onCenteredIndexChange={updateCenteredIndex}
      language={language}
    />
    <WorksPaintSplash activation={paintActivation} />
    <MtsFlyoutOverlay activation={flyoutActivation} visible={flyoutVisible} />
    <PresentationModal project={presentation} onClose={closePresentation} language={language} />
  </main>
}
