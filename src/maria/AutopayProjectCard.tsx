import type { Language } from './i18n'

type AutopayProjectCardProps = {
  language: Language
  loadArtwork: boolean
}

export default function AutopayProjectCard({ language, loadArtwork }: AutopayProjectCardProps) {
  return <div className="wallet-project-card autopay-project-card">
    <span className="wallet-project-card__surface" aria-hidden="true" />
    <span className="autopay-project-card__artwork" aria-hidden="true">
      {loadArtwork && <>
        <img className="autopay-project-card__arrows" src="/assets/maria/autopay-arrows.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="autopay-project-card__timer" src="/assets/maria/autopay-timer.webp" alt="" draggable="false" loading="eager" decoding="sync" />
        <img className="autopay-project-card__phones" src="/assets/maria/autopay-phones.webp" alt="" draggable="false" loading="eager" decoding="sync" />
      </>}
    </span>
    <span className="wallet-project-card__footer">
      <span className="wallet-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="wallet-project-card__copy">
        <strong className="wallet-project-card__title">{language === 'ru' ? 'Новый проект' : 'New project'}</strong>
        <span className="wallet-project-card__meta">{language === 'ru' ? 'Скоро' : 'Coming soon'}</span>
      </span>
    </span>
  </div>
}
