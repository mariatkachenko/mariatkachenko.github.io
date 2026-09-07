import { useEffect, useRef, useState } from 'react'
import PortfolioPage from './maria/PortfolioPage'
import FixedChrome from './maria/FixedChrome'
import WorksPage from './maria/WorksPage'
import HackathonsPage from './maria/HackathonsPage'
import { normalizePath, routeTransitionDirection } from './router'
import InteractionSounds from './maria/InteractionSounds'
import type { Language } from './maria/i18n'

const themeSwitchTokens = new WeakMap<Element, number>()
const THEME_COLORS = {
  light: '#c8c8ca',
  dark: '#05070d',
} as const

export function beginAtomicThemeSwitch(
  root: HTMLElement,
  schedule: (callback: FrameRequestCallback) => number = window.requestAnimationFrame.bind(window),
) {
  const token = (themeSwitchTokens.get(root) ?? 0) + 1
  themeSwitchTokens.set(root, token)
  root.setAttribute('data-theme-switching', 'true')
  schedule(() => schedule(() => {
    if (themeSwitchTokens.get(root) === token) root.removeAttribute('data-theme-switching')
  }))
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<Language>('ru')
  const [path, setPath] = useState(() => {
    const normalized = normalizePath(window.location.pathname)
    if (normalized !== window.location.pathname) window.history.replaceState({}, '', normalized)
    return normalized
  })
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back' | null>(null)
  const pathRef = useRef(path)

  useEffect(() => {
    const handleLocationChange = () => {
      const nextPath = normalizePath(window.location.pathname)
      setTransitionDirection(routeTransitionDirection(pathRef.current, nextPath))
      pathRef.current = nextPath
      setPath(nextPath)
    }
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (themeColor) themeColor.content = THEME_COLORS[theme]
  }, [theme])

  useEffect(() => {
    document.title = 'Maria Tkachenko Portfolio'
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.append(favicon)
    }
    favicon.type = 'image/svg+xml'
    favicon.href = '/favicon.svg'
  }, [])

  const changeTheme = (nextTheme: 'light' | 'dark') => {
    if (nextTheme === theme) return
    beginAtomicThemeSwitch(document.documentElement)
    setTheme(nextTheme)
  }

  return <div className={`maria-app theme-${theme}`}>
    <InteractionSounds />
    <FixedChrome theme={theme} onThemeChange={changeTheme} language={language} onLanguageChange={setLanguage} />
    <div
      className={`maria-route-content${transitionDirection ? ` maria-route-content--${transitionDirection}` : ''}`}
      key={path}
    >
      {path === '/works'
        ? <WorksPage language={language} />
        : path === '/hackathons'
          ? <HackathonsPage language={language} />
          : <PortfolioPage language={language} theme={theme} />}
    </div>
  </div>
}
