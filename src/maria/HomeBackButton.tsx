import { navigateWithTransition } from '../router'
import { copyFor, type Language } from './i18n'

export default function HomeBackButton({ language }: { language: Language }) {
  const label = copyFor(language).back

  return <button className="maria-back" type="button" aria-label={label} onClick={() => navigateWithTransition('/')}>
    <svg className="maria-back__arrow" viewBox="0 0 96 44" fill="none" aria-hidden="true">
      <path d="M90 8C69 8 57 14 47 21C37 28 29 31 15 31" />
      <path d="M27 20L14 31L27 40" />
    </svg>
    <span className="maria-back__label">{label}</span>
  </button>
}
