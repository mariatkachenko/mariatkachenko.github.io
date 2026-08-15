import type { CSSProperties } from 'react'
import HackathonOrbitCarousel from './HackathonOrbitCarousel'
import HomeBackButton from './HomeBackButton'
import InteractiveBackground from './InteractiveBackground'
import { copyFor, type Language } from './i18n'

export default function HackathonsPage({ language }: { language: Language }) {
  const copy = copyFor(language)
  return <main
    className="maria-subpage maria-hackathons-page"
    style={{
      '--mobile-model-scale': 1.25,
      '--mobile-porthole-size': 'min(188vw, 148vh)',
      '--mobile-card-bottom': '28vh',
    } as CSSProperties}
  >
    <HomeBackButton language={language} />
    <div className="maria-hackathons-porthole" data-sphere-style="asymmetric-radial" aria-hidden="true" />
    <InteractiveBackground showShimmer={false} />
    <HackathonOrbitCarousel language={language} />
  </main>
}
