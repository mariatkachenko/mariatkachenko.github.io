import { useEffect, useState } from 'react'
import PortfolioCard from './PortfolioCard'
import InteractiveBackground from './InteractiveBackground'
import { copyFor, type Language } from './i18n'

const HOME_PORTRAIT_SOURCES = {
  light: '/assets/maria/home-portrait-light-1280.webp 1280w, /assets/maria/home-portrait-light-1920.webp 1920w, /assets/maria/home-portrait-light-2560.webp 2560w, /assets/maria/home-portrait-light-3840.webp 3840w',
  dark: '/assets/maria/home-portrait-dark-1200.webp 1200w, /assets/maria/home-portrait-dark-1800.webp 1800w, /assets/maria/home-portrait-dark-2400.webp 2400w',
} as const

export default function PortfolioPage({ language, theme }: { language: Language; theme: 'light' | 'dark' }) {
  const copy = copyFor(language)
  const [loadInactiveTheme, setLoadInactiveTheme] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadInactiveTheme(true), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  const loadLightPortrait = theme === 'light' || loadInactiveTheme
  const loadDarkPortrait = theme === 'dark' || loadInactiveTheme
  return <div className="maria-page">
    <div className="maria-viewport">
      <div className="maria-home-portraits" aria-hidden="true">
        <img
          className="maria-home-portrait maria-home-portrait--light"
          src={loadLightPortrait ? '/assets/maria/home-portrait-light-3840.webp' : undefined}
          srcSet={loadLightPortrait ? HOME_PORTRAIT_SOURCES.light : undefined}
          sizes="100vw"
          alt=""
          decoding="async"
          fetchPriority={theme === 'light' ? 'high' : 'auto'}
        />
        <img
          className="maria-home-portrait maria-home-portrait--dark"
          src={loadDarkPortrait ? '/assets/maria/home-portrait-dark-2400.webp' : undefined}
          srcSet={loadDarkPortrait ? HOME_PORTRAIT_SOURCES.dark : undefined}
          sizes="(max-width: 600px) 140vw, 100vw"
          alt=""
          decoding="async"
          fetchPriority={theme === 'dark' ? 'high' : 'auto'}
        />
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
