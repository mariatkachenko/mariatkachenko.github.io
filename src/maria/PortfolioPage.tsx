import PortfolioCard from './PortfolioCard'
import InteractiveBackground from './InteractiveBackground'
import { copyFor, type Language } from './i18n'

export default function PortfolioPage({ language }: { language: Language }) {
  const copy = copyFor(language)
  return <div className="maria-page">
    <div className="maria-viewport">
      <div className="maria-home-portraits" aria-hidden="true">
        <img className="maria-home-portrait maria-home-portrait--light" src="/assets/maria/home-portrait-light.png" alt="" />
        <img className="maria-home-portrait maria-home-portrait--dark" src="/assets/maria/home-portrait-dark.png" alt="" />
      </div>
      <InteractiveBackground showModel={false} />
    </div>
    <div className="maria-scroll-content">
    <main className="maria-stage">
      <PortfolioCard title={copy.homeWorks} note={copy.worksNote} href="/works" variant="works" />
      <PortfolioCard title={copy.homeAbout} note={copy.hackathonsNote} href="/hackathons" variant="hackathons" />
    </main>
    </div>
  </div>
}
