import { useCallback, useRef, useState, type CSSProperties } from 'react'
import PresentationModal from './PresentationModal'
import WorksCardCarousel, { handVariantForWorksPosition, worksPatternOffset, WORKS_INITIAL_POSITION } from './WorksCardCarousel'
import HomeBackButton from './HomeBackButton'
import WorksPaintSplash, { shouldTriggerWorksPaintSplash } from './WorksPaintSplash'
import { type Language } from './i18n'

export default function WorksPage({ language }: { language: Language }) {
  const [presentationOpen, setPresentationOpen] = useState(false)
  const [handVariant, setHandVariant] = useState(() => handVariantForWorksPosition(WORKS_INITIAL_POSITION))
  const [patternOffset, setPatternOffset] = useState(() => worksPatternOffset(WORKS_INITIAL_POSITION))
  const [paintActivation, setPaintActivation] = useState(0)
  const previousCenteredIndex = useRef<number | null>(WORKS_INITIAL_POSITION)
  const closePresentation = useCallback(() => setPresentationOpen(false), [])
  const updateScene = useCallback((position: number) => {
    setHandVariant(handVariantForWorksPosition(position))
    setPatternOffset(worksPatternOffset(position))
  }, [])
  const updateCenteredIndex = useCallback((nextIndex: number) => {
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
      onOpen={() => setPresentationOpen(true)}
      onPositionChange={updateScene}
      onCenteredIndexChange={updateCenteredIndex}
      language={language}
    />
    <WorksPaintSplash activation={paintActivation} />
    <PresentationModal open={presentationOpen} onClose={closePresentation} language={language} />
  </main>
}
