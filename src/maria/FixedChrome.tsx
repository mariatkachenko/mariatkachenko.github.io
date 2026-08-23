import { copyFor, type Language } from './i18n'

type FixedChromeProps = {
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function FixedChrome({ theme, onThemeChange, language, onLanguageChange }: FixedChromeProps) {
  const copy = copyFor(language)
  return <>
    <header className="maria-header maria-fixed-top">
      <div className="maria-identity">
        <span className="maria-avatar" aria-hidden="true"><img src="/assets/maria/portrait-lossless.webp" alt="" /></span>
        <h1>{copy.name}</h1>
      </div>
      <a href="mailto:mery.tkachenko@gmail.com">mery.tkachenko@gmail.com</a>
      <div className="maria-meta"><a href="https://t.me/marykllj" target="_blank" rel="noreferrer">@marykllj</a><span>Moscow</span></div>
      <a className="maria-contact" href="mailto:mery.tkachenko@gmail.com">{copy.contact} <span aria-hidden="true">↗</span></a>
    </header>
    <footer className="maria-controls maria-fixed-bottom">
      <div className="maria-languages"><button type="button" aria-label="Русский" aria-pressed={language === 'ru'} className={language === 'ru' ? 'is-active' : ''} onClick={() => onLanguageChange('ru')}>RU</button><span>|</span><button type="button" aria-label="English" aria-pressed={language === 'en'} className={language === 'en' ? 'is-active' : ''} onClick={() => onLanguageChange('en')}>EN</button></div>
      <div className="maria-theme" aria-label={copy.theme}>
        <button type="button" className={theme === 'light' ? 'is-active' : ''} aria-label={copy.lightTheme} aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}><img src="/assets/maria/theme-sun-lossless.webp" alt="" /></button>
        <span aria-hidden="true">|</span>
        <button type="button" className={theme === 'dark' ? 'is-active' : ''} aria-label={copy.darkTheme} aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}><img src="/assets/maria/theme-moon-lossless.webp" alt="" /></button>
      </div>
    </footer>
  </>
}
