import type { Language } from './i18n'

type SbpProjectCardProps = {
  onOpen: () => void
  ariaLabel: string
  language: Language
  loadArtwork: boolean
}

export default function SbpProjectCard({ onOpen, ariaLabel, language, loadArtwork }: SbpProjectCardProps) {
  return <button className="wallet-project-card sbp-project-card" type="button" onClick={onOpen} aria-label={ariaLabel}>
    <span className="wallet-project-card__surface" aria-hidden="true" />
    <span className="sbp-project-card__artwork" aria-hidden="true">
      {loadArtwork && (
        <img className="sbp-project-card__phones" src="/assets/maria/sbp-phones.png" alt="" draggable="false" loading="eager" decoding="sync" />
      )}
    </span>
    <span className="wallet-project-card__footer">
      <span className="wallet-project-card__file-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.4 4.5h6.7l4.4 4.4v8.6a2 2 0 0 1-2 2H7.4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M14.1 4.8v4.1h4.1M9.1 11.2l2.8-1.6 2.8 1.6v3.2L12 16l-2.8-1.6v-3.2Z" />
        </svg>
      </span>
      <span className="wallet-project-card__copy">
        <strong className="wallet-project-card__title">{language === 'ru' ? 'Оплата по QR' : 'QR Payment'}</strong>
        <span className="wallet-project-card__meta">{language === 'ru' ? 'МТС Финтех 2024' : 'MTS Fintech 2024'}</span>
      </span>
    </span>
  </button>
}
